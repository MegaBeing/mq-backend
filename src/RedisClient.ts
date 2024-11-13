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

    async set(key: string, value: any){
        await this.client.set(key, value);
    }

    async get(key: string){
        await this.client.get(key);
    }
}