import { RedisClientType } from "redis";
import { Bucket } from "../types/bucket.types.js";
import { BucketStorage } from "./BucketStorage.js";

export class RedisStorage implements BucketStorage {
    constructor(
        private readonly redis: RedisClientType
    ) {}

    async get(key: string): Promise<Bucket | null> {

        const value = await this.redis.get(key);

        if (!value) {
            return null;
        }

        return JSON.parse(value) as Bucket;
    }

    async set(key: string, bucket: Bucket): Promise<void> {

        await this.redis.set(
            key,
            JSON.stringify(bucket)
        );
    }
}