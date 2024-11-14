import { EmailQueue } from "./EmailQueue";
import { MessageBody } from "../types";
import { EmailWorker } from "./EmailWorker";
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});


export class QCreator {
    #worker: any;
    #queue: any;
    constructor (redisConnection: any) {
        this.#worker = new EmailWorker(transporter,redisConnection)
        this.#queue = new EmailQueue(redisConnection);
    }
    async createMsgQ(email: string) {
        try {
            for (let i = 0; i < 5; i++) {
                let message : MessageBody= {
                    from: process.env.EMAIL as string,
                    to: email,
                    subject: "Signed In To MQ Website",
                    html: `<h1> Q-element -> ${i} </h1>`,
                };
                await this.#queue.addMsg(i, message)
            }
            await new Promise((resolve, reject) => {
                this.#worker .OnComplete((error: any, info: any) => {
                    resolve(info);
                })
                this.#worker .OnFailed((error: any, info: any) => {
                    reject(error);
                })
                setTimeout(() => {
                    reject('Job failed due to time out');
                }, 10000);
            }).then((message) => {
                console.log('Success Message: ', message)
            }).catch((error) => {
                console.log('Error Message: ', error)
                throw new Error(error);
            })
        } catch (error) {
            throw error;
        }
    }
}