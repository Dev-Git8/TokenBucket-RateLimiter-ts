import { Bucket } from "../types/bucket.types.js"

export class BucketStorage {
    private readonly buckets = new Map<string, Bucket>();

    // One lock queue per key (user/IP/API key)
    private readonly locks = new Map<string, Promise<void>>();

    public async consume(
        key: string,
        capacity: number,
        refillRate: number
    ): Promise<boolean> {
        return this.withLock(key, async () => {
            const bucket = this.getOrCreateBucket(key, capacity);

            this.refill(bucket, capacity, refillRate);

            if (bucket.tokens < 1) {
                return false;
            }

            bucket.tokens--;

            return true;
        });
    }

    private getOrCreateBucket(
        key: string,
        capacity: number
    ): Bucket {
        let bucket = this.buckets.get(key);

        if (!bucket) {
            bucket = {
                tokens: capacity,
                lastRefill: Date.now(),
            };

            this.buckets.set(key, bucket);
        }

        return bucket;
    }

    private refill(
        bucket: Bucket,
        capacity: number,
        refillRate: number
    ): void {
        const now = Date.now();

        const elapsed = (now - bucket.lastRefill) / 1000;

        const tokensToAdd = elapsed * refillRate;

        bucket.tokens = Math.min(
            capacity,
            bucket.tokens + tokensToAdd
        );

        bucket.lastRefill = now;
    }

    /**
     * Executes only one operation at a time for a given key.
     */
    private async withLock<T>(
        key: string,
        operation: () => Promise<T>
    ): Promise<T> {

        const previousLock = this.locks.get(key);

        let release!: () => void;

        const currentLock = new Promise<void>((resolve) => {
            release = resolve;
        });

        // Become the new tail of the queue.
        this.locks.set(key, currentLock);

        // Wait for whoever was ahead of us.
        if (previousLock) {
            await previousLock;
        }

        try {
            return await operation();
        } finally {
            // Release the next waiter.
            release();

            // Remove the lock if nobody replaced it.
            if (this.locks.get(key) === currentLock) {
                this.locks.delete(key);
            }
        }
    }
}