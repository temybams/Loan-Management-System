import { RedisOptions } from 'ioredis';

function getRedisConfig(): RedisOptions {
    const redisUrl = process.env.REDIS_URL;

    if (redisUrl) {
        const url = new URL(redisUrl);

        return {
            host: url.hostname,
            port: Number(url.port || 6379),
            username: url.username || undefined,
            password: url.password || undefined,
            tls: url.protocol === "rediss:" ? {} : undefined,
        };
    }

    return {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: Number(process.env.REDIS_PORT || 6379),
        password: process.env.REDIS_PASSWORD || undefined,
    };
}

export const redisConfig: RedisOptions = getRedisConfig();
