// Client Connection
const { MongoClient, ServerApiVersion } = require('mongodb');
export class MongoDBClient {
    client : any
    async create_connection() {
        try{
        const URI = process.env.MONGODB_URI
        this.client = new MongoClient(URI, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        }
        )
        await this.client.connect();
        console.log(`MongoDB Server Connected 👍`)
    }catch(error){
        throw error;
    }
    }
    async get_db(db: string) {
        
        return await this.client.db(db)
    }
    async close_connection() {
        await this.client.close();
        console.log("MongoDB client closed. Exiting process.");
    }
    async gracefulShutdown(signal: string) {
        console.log(`Received ${signal}. Closing MongoDB client.`);
        await this.close_connection();
        process.exit(0);
    }
}