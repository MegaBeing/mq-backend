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
    }
}