import { Bucket } from "./Bucket";
/**
 * Contract for bucket storage implementations.
 *
 * Implementations may store buckets in memory,
 * Redis, or any other persistence layer.
 */
export interface BucketStore {
    get(key: string): Bucket | undefined;

    set(key: string, bucket: Bucket): void;

    delete(key: string): void;

    getOrCreate(
        key: string,
        capacity: number,
        now: number
    ): Bucket;

    entries(): IterableIterator<[string, Bucket]>;

    size(): number;
}