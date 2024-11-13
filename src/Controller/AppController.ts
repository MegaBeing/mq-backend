import { StatusCodes } from 'http-status-codes';
import validateEmail from "./validateEmail";
import { QCreator } from "./QCreator";
import { EmailCollection } from '../Models/EmailCollection';
import { MongoClientObj, RedisClientObj} from '../routes';
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
            const db = MongoClientObj.get_db('Data')
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
}
