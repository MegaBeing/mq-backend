// Client Connection
const { MongoClient } = require("mongodb");
const url = process.env.MONGODB_URL

export class Client{
    client : any

    constructor() {
        this.client = new MongoClient(url);
        this.create_connection();
    }

    async create_connection(){
        await this.client.connect();
    }

    async close_connection(){
        await this.client.close();
        console.log("MongoDB client closed. Exiting process.");
    }
    async gracefulShutdown(signal: string){
        console.log(`Received ${signal}. Closing MongoDB client.`); 
        await this.close_connection();
        process.exit(0);
    }
}