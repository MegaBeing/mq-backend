import { Queue, Worker } from "bullmq";
const nodemailer = require('nodemailer') // import

const transporter = nodemailer.createTransport({
    host: "gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

export class EmailMessageQ{
    #q: Queue;
    #worker: Worker;

    constructor() {
        this.#q = new Queue('emailQ', {
            connection: {
                host: '127.0.0.1',
                port: 6379
            },
            defaultJobOptions: {
                removeOnComplete: true, removeOnFail: 1000
            }
        })
    
        this.#worker = new Worker('emailQ', async (job) => {
            const { data } = job;
            try {
                await new Promise((resolve, reject) => {
                    transporter.sendMail(data, (error: any, info: any) => {
                        if (error) {
                            reject(error)
                        }
                        else {
                            resolve(info)
                        }
                    })
                })
            } catch (error) {
                throw error;
            }
        },
            {
                connection: {
                    host: '127.0.0.1',
                    port: 6379
                }
            })
    }
    

    async createMsgQ(email: string) {
        try {
            for (let i = 0; i < 5; i++) {
                let message = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: "Signed In To MQ Website",
                    html: `<h1> Q-element -> ${i} </h1>`,
                };
                await this.#q.add(`emailQelement -> ${i}`, { data: message })
            }
            await new Promise((resolve, reject) => {
                this.#worker.on('completed',(error: any, info: any) =>{
                    resolve(info);
                })
                this.#worker.on('failed',(error:any, info: any) => {
                    reject(error);
                })
                setTimeout(() => {
                    reject('Job failed due to time out');
                }, 10000);
            })
        }catch(error){
            throw error;
        }
    }
}