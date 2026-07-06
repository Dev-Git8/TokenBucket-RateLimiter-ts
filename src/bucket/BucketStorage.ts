import { Bucket } from "./interfaces/Bucket";
import { BucketStore } from "./interfaces/BucketStore";

/**
 * In-memory implementation of the BucketStore interface.
 *
 * Stores buckets using a JavaScript Map.
 */


export class BucketStorage implements BucketStore {
    private readonly buckets = new Map<string, Bucket>();

    /**
 * Retrieves the bucket associated with the given key.
 *
 * @param key Bucket identifier.
 * @returns The bucket if it exists; otherwise undefined.
 */

    public get(key: string): Bucket | undefined {
        return this.buckets.get(key);
    }
/**
 * Stores a bucket using the specified key.
 *
 * @param key Bucket identifier.
 * @param bucket Bucket to store.
 */
    public set(key: string, bucket: Bucket): void {
        this.buckets.set(key, bucket);
    }
/**
 * Removes the bucket associated with the given key.
 *
 * @param key Bucket identifier.
 */
    public delete(key: string): void {
        this.buckets.delete(key);
    }


    /**
 * Returns the bucket associated with the given key.
 *
 * If no bucket exists, a new bucket is created with
 * the provided capacity.
 *
 * @param key Bucket identifier.
 * @param capacity Maximum bucket capacity.
 * @param now Current timestamp in milliseconds.
 * @returns The existing or newly created bucket.
 */
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
/**
 * Returns an iterator over all stored buckets.
 *
 * @returns Iterator of key-bucket pairs.
 */
    public entries(): IterableIterator<[string, Bucket]> {
        return this.buckets.entries();
    }



    /**
 * Returns the total number of buckets currently stored.
 *
 * @returns Bucket count.
 */
    public size(): number {
        return this.buckets.size;
    }
}