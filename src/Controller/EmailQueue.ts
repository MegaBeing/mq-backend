import { Queue } from "bullmq";
import { MessageBody } from "../types";

export class EmailQueue{
    #q: Queue;
    constructor(redisConnection: any) {
        this.#q = new Queue('EMAIL_QUEUE', {
            connection: redisConnection,
            defaultJobOptions: {
                removeOnComplete: true, removeOnFail: 1000
            }
        })
    }
    async addMsg(index: number, message: MessageBody){
        this.#q.add(`emailQelement -> ${index}`, { data: message })
    }
}