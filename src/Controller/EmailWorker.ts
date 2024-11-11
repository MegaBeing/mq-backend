import { Worker } from "bullmq";

export class EmailWorker {
    #worker: Worker

    constructor(transporter: any) {
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
                connection: {
                    host: '127.0.0.1',
                    port: 6379
                }
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