import { Bucket, ConsumeResult } from "../types/bucket.types.js";
import { BucketStorage } from "../bucket/BucketStorage.js";

export class MemoryStorage implements BucketStorage {

    private buckets = new Map<string, Bucket>();

    async consume(
        key: string,
        capacity: number,
        refillRate: number
    ): Promise<ConsumeResult> {

    }

}