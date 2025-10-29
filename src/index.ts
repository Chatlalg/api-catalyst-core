import { createClient } from "redis"
import type { RedisClientOptions } from "redis"
import type { RedisClientType } from "./types.js";
import axios, { AxiosError, type AxiosRequestConfig } from "axios"

export class ApiCatalyst {
    private config: RedisClientOptions = {};
    private client: RedisClientType;
    private api_key: string = "";

    constructor(config: RedisClientOptions) {
        this.config = config;
        this.client = createClient(this.config);
    }

    async connect(): Promise<void> {
        try {
            this.client.on('error', (err) => console.log('Redis Client Error', err));
            const response = await this.client.connect();
            console.log("Connected to Redis successfully");
        } catch (error) {
            console.error("Error connecting to Redis:", error);
        }
    }

    async get(route: string, config?: AxiosRequestConfig): Promise<any> {
        try {
            const cacheHit: number = await this.client.exists(route);
            if (cacheHit) {
                const cacheResponse = await this.client.hGetAll(route);
                const data = JSON.parse(cacheResponse.fields as string)
                return { data };
            }
            const apiResponse = await axios.get(route, config);
            const fields = JSON.stringify(apiResponse.data)
            const hydrateCache = await this.client.HSET(route, { fields });
            return apiResponse;
        } catch (error) {
            console.log("Internal server error:", error)
            return;
        }
    }

    destroy(): void {
        try {
            const response = this.client.destroy();
            console.log("Successfully destroyed client connection");
        } catch (error) {
            console.error("Error disconnecting from Redis:", error);
        }
    }


}