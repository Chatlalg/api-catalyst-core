import { createClient } from "redis"
import type {RedisClientOptions} from "redis"
import type { RedisClientType } from "./types.js";

export class ApiCatalyst {
    private config: RedisClientOptions = {};
    private client: RedisClientType;

    constructor(config:RedisClientOptions){
        this.config = config;
        this.client = createClient(this.config);
    }

    async connect():Promise<RedisClientType|undefined>{ 
        try {
            this.client.on('error', (err) => console.log('Redis Client Error', err));
            const response = await this.client.connect();
            console.log("Connected to Redis successfully", response);
            return this.client;
        } catch (error) {
            console.error("Error connecting to Redis:", error);
        }
    }

    destroy() : void{
        try {
            const response = this.client.destroy();
            console.log("Successfully destroyed client connection", response);
        } catch (error) {
            console.error("Error disconnecting from Redis:", error);   
        }
    }
}