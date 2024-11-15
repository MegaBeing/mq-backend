const nodemailer = require('nodemailer')

export class NodeMailer {
    transporter: any;
    async create_transport() {
        this.transporter = await nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });
        console.log(`NodeMailer Transporter Created 👍`)
    }
}