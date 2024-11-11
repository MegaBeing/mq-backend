import { Queue } from "bullmq";
import { MessageBody } from "../types";

export class EmailQueue{
    #q: Queue;
    constructor() {
        this.#q = new Queue('EMAIL_QUEUE', {
            connection: {
                host: '127.0.0.1',
                port: 6379
            },
            defaultJobOptions: {
                removeOnComplete: true, removeOnFail: 1000
            }
        })
    }
    async addMsg(index: number, message: MessageBody){
        this.#q.add(`emailQelement -> ${index}`, { data: message })
    }
}