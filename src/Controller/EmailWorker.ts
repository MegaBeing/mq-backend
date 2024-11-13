import { Worker } from "bullmq";

export class EmailWorker {
    #worker: Worker

    constructor(transporter: any, redisConnection: any) {
        try{
        this.#worker = new Worker('EMAIL_QUEUE', async (job) => {
            const { data } = job;
            try {
                console.log('----->')
                console.log(data)
                await new Promise((resolve, reject) => {
                    transporter.sendMail(data, (error: any, info: any) => {
                        if (error) {
                            reject(error)
                        }
                        else {
                            resolve('Email sent successfully')
                        }
                    })
                }).then((message) => {
                    console.log("Transporter Success Message:", message)
                }).catch((error) => {
                    // console.log("Transporter Error Message:", error)
                    throw error
                })
            } catch (error) {
                throw error;
            }
        },
            {
                connection: redisConnection
            })
        }catch(error) {
            throw error;
        }
    }
    OnComplete(callback: any){
        return this.#worker.on('completed', callback)
    }
    OnFailed(callback: any){
        return this.#worker.on('failed', callback)
    }
}