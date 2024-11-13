import { StatusCodes } from 'http-status-codes';
import validateEmail from "./validateEmail";
import { QCreator } from "./QCreator";
import { Client } from '../Models/Client';
import { EmailCollection } from '../Models/EmailCollection';

const ClientObj = new Client();
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
            await ClientObj.create_connection();
            const db = ClientObj.client.db('Data')
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

process.on('SIGINT', ClientObj.gracefulShutdown);    
process.on('SIGTERM', ClientObj.gracefulShutdown);   
process.on('SIGUSR2', ClientObj.gracefulShutdown);

process.on('uncaughtException', async (err) => {
    console.error("Uncaught Exception:", err);
    await ClientObj.close_connection();
    process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    await ClientObj.close_connection();
    process.exit(1);
});