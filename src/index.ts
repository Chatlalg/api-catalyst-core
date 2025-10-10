import { createClient } from "redis"
import type { RedisClientOptions } from "redis"
import type { RedisClientType } from "./types.js";

export class ApiCatalyst {
    private config: RedisClientOptions = {};
    private client: RedisClientType;

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

    destroy(): void {
        try {
            const response = this.client.destroy();
            console.log("Successfully destroyed client connection");
        } catch (error) {
            console.error("Error disconnecting from Redis:", error);
        }
    }

    async set(key: string, value: string): Promise<string | null | undefined> {
        try {
            const response = await this.client.set(key, value);
            return response;
        } catch (error) {
            console.error(`Error setting key ${key}:`, error);
        }
    }

    async get(key: string): Promise<string | null> {
        try {
            const response = await this.client.get(key);
            return response;
        } catch (error) {
            console.error(`Error getting key ${key}:`, error);
            return null;
        }
    }

    async del(key: string): Promise<number | undefined> {
        try {
            const response = await this.client.del(key);
            return response
        } catch (error) {
            console.error(`Error deleting key ${key}:`, error);
        }
    }
}