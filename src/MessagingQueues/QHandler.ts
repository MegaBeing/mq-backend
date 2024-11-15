import { MessageBody } from "../types";
import { EmailQueueObj } from "../routes";

export class QHandler {
    q: any
    constructor(redisConnection: any) {
        this.q = EmailQueueObj
    }
    async createMsgQ(email: string) {
        try {
            for (let i = 0; i < 5; i++) {
                let message: MessageBody = {
                    from: process.env.EMAIL as string,
                    to: email,
                    subject: "Signed In To MQ Website",
                    html: `<h1> Q-element -> ${i + 1} </h1>`,
                };
                await this.q.addMsg(i + 1, message)
            }
        } catch (error) {
            console.error('Failed to create message queue:', error);
            throw error;
        }
    }
}