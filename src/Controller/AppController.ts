import { StatusCodes } from 'http-status-codes';
import validateEmail from "./validateEmail";
import { QCreator } from "./QCreator";
import { EmailCollection } from '../Models/EmailCollection';
import { MongoClientObj, RedisClientObj} from '../routes';
import { json } from 'body-parser';
import { EmailDocument } from '../types';
export default class AppController {
    async ValidateNdExecuteEmailQ(req: any, res: any) {
        try {
            const email = req.body.email;
            const EmailVal = validateEmail(email);
            if(!EmailVal)
            {
                console.log({
                    status: StatusCodes.NOT_ACCEPTABLE,
                    message: "Not a valid Email"
                })
                res.status(StatusCodes.NOT_ACCEPTABLE).json({
                    status: StatusCodes.NOT_ACCEPTABLE,
                    message: "Not a valid Email"
                });
                return;
            }
            // DB Queries
            const db = await MongoClientObj.get_db('Data')
            const EmailCollectionObj = new EmailCollection('Email',db);
            EmailCollectionObj.create(email);

            // Controller Queries
            const redisConnection = RedisClientObj.client
            const QObject = new QCreator(redisConnection);
            await QObject.createMsgQ(email);
            
            console.log({
                status: StatusCodes.OK,
                message: "Sent message to the user"
            })
            res.status(StatusCodes.OK).json({
                status: StatusCodes.OK,
                message: "Sent message to the user"
            });

        } catch (error: any) {

            console.log({
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                message: error.message
            })
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                message: error.message
            });
        }
    }

    async Query(req: any, res: any){
        try{
            const email = req.body.email;
            const EmailVal = validateEmail(email);
            if(!EmailVal)
            {
                console.log({
                    status: StatusCodes.NOT_ACCEPTABLE,
                    message: "Not a valid Email"
                })

                res.status(StatusCodes.NOT_ACCEPTABLE).json({
                    status: StatusCodes.NOT_ACCEPTABLE,
                    message: "Not a valid Email"
                });
                return;
            }

            const start = new Date().getTime(); 

            // Redis Search
            const timestamp_via_redis: string = await RedisClientObj.get(email);
            if(timestamp_via_redis) // cache hit
            {   
                const end = new Date().getTime();
                const executionTime = end - start; 
                console.log({
                    status: StatusCodes.ACCEPTED,
                    timestamp: timestamp_via_redis,
                    time_taken: executionTime
                })
                res.status(StatusCodes.ACCEPTED).json({
                    status: StatusCodes.ACCEPTED,
                    timestamp: timestamp_via_redis,
                    execution_time: executionTime
                })
                return;
            }

            // cache miss
            const db = await MongoClientObj.get_db('Data')
            const EmailCollectionObj = new EmailCollection('Email',db);
            const timestamp_via_db: string | undefined = (await EmailCollectionObj.read({email})).dateTime
            if(!timestamp_via_db)
            {
                res.status(StatusCodes.BAD_REQUEST).json({
                    status: StatusCodes.BAD_REQUEST,
                    message: "Email not found"
                })
            }
            const end = new Date().getTime();
            const executionTime = end - start; 
            // memoization query 
            await RedisClientObj.set(email,timestamp_via_db); 
            console.log({
                status: StatusCodes.ACCEPTED,
                timestamp: timestamp_via_db,
                time_taken: executionTime
            })
            res.status(StatusCodes.ACCEPTED).json({
                status: StatusCodes.ACCEPTED,
                timestamp: timestamp_via_db,
                time_taken: executionTime
            })

        }
        catch(error){
            throw error;
        }
    }
}
