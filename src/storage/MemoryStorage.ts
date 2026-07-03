
import { Bucket } from "../types/bucket.types.js"
import { BucketStorage } from "./BucketStorage.js"


export class MemoryStorage implements BucketStorage {
     
    private bucket = new Map<string, Bucket>();

    async get(key: string): Promise<Bucket | null>{
        return this.bucket.get(key) ?? null;
    }

    async set(key: string, bucket: Bucket): Promise<void>{
        this.bucket.set(key, bucket);
    }

}