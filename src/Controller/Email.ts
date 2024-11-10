import { StatusCodes } from 'http-status-codes';
import validateEmail from "./validateEmail";
import { EmailMessageQ } from "./emailMessageQ";

export default class Email {
    ValidateNdExecuteEmailQ(req: any, res: any) {
        try {
            const { email } = req.body;
            validateEmail(email);

            const QObject = new EmailMessageQ();
            QObject.createMsgQ(email);

            res.status(StatusCodes.OK).json({
                status: StatusCodes.OK,
                message: "Sent message to the user"
            });
        } catch (error: any) {
            res.status(StatusCodes.BAD_REQUEST).json({
                status: StatusCodes.BAD_REQUEST,
                message: error.message || "Invalid request"
            });
        }
    }
}