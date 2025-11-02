import type {createClient} from "redis"

export type RedisClientType = ReturnType<typeof createClient>;

export type AuthenticationConfig = {
    api_key : string;
    email: string;
}