import { Queue } from "bullmq";
import { MessageBody } from "../types";

export class EmailQueue{
    q: any;
    create(redisConnection: any) {
        this.q = new Queue('EMAIL_QUEUE', {
            connection: redisConnection,
            defaultJobOptions: {
                removeOnComplete: true, removeOnFail: 1000
            }
        })
        console.log(`Queue Created 👍`)
    }
    async addMsg(index: number, message: MessageBody){
        this.q.add(`emailQelement -> ${index}`, { data: message })
        console.log(message)
    }
}