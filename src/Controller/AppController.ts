import { StatusCodes } from 'http-status-codes';
import validateEmail from "./validateEmail";
import { QCreator } from "./QCreator";
import { EmailCollection } from '../Models/EmailCollection';
import { MongoClientObj} from '../routes';
export default class AppController {
    async ValidateNdExecuteEmailQ(req: any, res: any) {
        try {
            const email = req.body.email;
            const EmailVal = validateEmail(email);
            if(!EmailVal)
            {
                res.status(StatusCodes.NOT_ACCEPTABLE).json({
                    status: StatusCodes.OK,
                    message: "Sent message to the user"
                });
                return;
            }
            // DB Queries
            const db = MongoClientObj.get_db('Data')
            const EmailCollectionObj = new EmailCollection('Email',db);
            EmailCollectionObj.create(email);

            // Controller Queries
            const QObject = new QCreator();
            await QObject.createMsgQ(email);
            
            res.status(StatusCodes.OK).json({
                status: StatusCodes.OK,
                message: "Sent message to the user"
            });

        } catch (error: any) {

            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                message: error.message
            });
        }
    }
}
