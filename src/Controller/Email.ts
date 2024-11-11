import { StatusCodes } from 'http-status-codes';
import validateEmail from "./validateEmail";
import { EmailMessageQ } from "./EmailMessageQ";
import { RequestBody } from '../types';

export default class Email {
    async ValidateNdExecuteEmailQ(req: any, res: any) {
        try {
            const email = req.body.email;
            console.log(process.env.EMAIL)
            validateEmail(email);

            const QObject = new EmailMessageQ();
            await QObject.createMsgQ(email);

            res.status(StatusCodes.OK).json({
                status: StatusCodes.OK,
                message: "Sent message to the user"
            });

        } catch (error: any) {

            res.status(StatusCodes.BAD_REQUEST).json({
                status: StatusCodes.BAD_REQUEST,
                message: error.message
            });
        }
    }
}