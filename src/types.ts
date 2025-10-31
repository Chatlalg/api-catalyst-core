import type {createClient} from "redis"

export type RedisClientType = ReturnType<typeof createClient>;

export interface AuthenticationConfig {
    api_key : string;
    email: string;
}