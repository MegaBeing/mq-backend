import { createClient } from "redis";

export class RedisClient {
    client: any
    async create_connection() {
        this.client = createClient({
            url: process.env.REDIS_URL
        })
        await this.client.connect();
        console.log(`Redis Server Connected 👍`)
    }
}