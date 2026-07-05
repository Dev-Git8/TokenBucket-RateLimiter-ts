import { Bucket } from "./interfaces/Bucket";
import { BucketStore } from "./interfaces/BucketStore";

export class BucketStorage implements BucketStore {
    private readonly buckets = new Map<string, Bucket>();

    public get(key: string): Bucket | undefined {
        return this.buckets.get(key);
    }

    public set(key: string, bucket: Bucket): void {
        this.buckets.set(key, bucket);
    }

    public delete(key: string): void {
        this.buckets.delete(key);
    }

    public getOrCreate(
        key: string,
        capacity: number,
        now: number
    ): Bucket {
        let bucket = this.buckets.get(key);

        if (!bucket) {
            bucket = {
                tokens: capacity,
                lastRefill: now,
                lastAccess: now,
            };

            this.buckets.set(key, bucket);
        }

        return bucket;
    }

    public entries(): IterableIterator<[string, Bucket]> {
        return this.buckets.entries();
    }

    public size(): number {
        return this.buckets.size;
    }
}