/**
 * A production-grade in-memory Token Bucket rate limiter.
 *
 * This implementation uses the Token Bucket algorithm with
 * fractional token refilling, per-key asynchronous locking,
 * and automatic cleanup of idle buckets.
 *
 * @example
 * ```ts
 * const limiter = new TokenBucket({
 *   capacity: 10,
 *   refillRate: 5,
 *   cleanup: {
 *     cleanupInterval: 60000,
 *     maxIdleTime: 300000,
 *   },
 * });
 * ```
 */

import { Bucket } from "./interfaces/Bucket";
import { ConsumeResult } from "./interfaces/ConsumeResult";
import { TokenBucketOptions } from "./interfaces/TokenBucketOptions";

import { BucketStorage } from "./BucketStorage";
import { BucketCleanup } from "./BucketCleanup";
import { LockManager } from "./LockManager";
import { BucketStore } from "./interfaces/BucketStore";
import { LockProvider } from "./interfaces/LockProvider";
import { RateLimiter } from "./interfaces/RateLimiter";

import { Clock, SystemClock } from "../clock";

export class TokenBucket implements RateLimiter {
    /**
 * Creates a new Token Bucket rate limiter.
 *
 * @param options Configuration options for the rate limiter.
 */
    private readonly storage: BucketStore;
    private readonly lockManager: LockProvider;
    private readonly clock: Clock;
    private readonly cleanup: BucketCleanup;

    constructor(private readonly options: TokenBucketOptions) {
        this.storage = options.storage ?? new BucketStorage();

        this.lockManager = options.lockManager ?? new LockManager();

        this.clock =
            options.clock ?? new SystemClock();

        this.cleanup = new BucketCleanup(
            this.storage,
            this.clock,
            options.cleanup.cleanupInterval,
            options.cleanup.maxIdleTime
        );

        this.cleanup.start();
    }
    /**
 * Attempts to consume a single token from the bucket
 * associated with the supplied key.
 *
 * If sufficient tokens are available, one token is consumed
 * and the request is allowed. Otherwise, the request is
 * rejected and the required retry time is returned.
 *
 * @param key Unique identifier for the bucket.
 * @returns The result of the consume operation.
 */

   public async consume(key: string): Promise<ConsumeResult> {
    return this.lockManager.withLock(key, async () => {
        const now = this.clock.now();

        const bucket = this.storage.getOrCreate(
            key,
            this.options.capacity,
            now
        );

        bucket.lastAccess = now;

        this.refill(bucket, now);

        if (!this.canConsume(bucket)) {
            const retryAfter = this.calculateRetryAfter(bucket);

            return {
                allowed: false,
                remainingTokens: Math.floor(bucket.tokens),
                retryAfter,
                limit: this.options.capacity,
                resetAfter: retryAfter,
            };
        }

        this.consumeToken(bucket);

        return {
            allowed: true,
            remainingTokens: Math.floor(bucket.tokens),
            retryAfter: null,
            limit: this.options.capacity,
            resetAfter: 0,
        };
    });
}
/**
 * Stops the background cleanup task and releases
 * any timer resources held by the rate limiter.
 */
    public destroy(): void {
        
        this.cleanup.stop();
    }

    private refill(bucket: Bucket, now: number): void {
        const elapsedSeconds =
            (now - bucket.lastRefill) / 1000;

        const tokensToAdd =
            elapsedSeconds * this.options.refillRate;

        bucket.tokens = Math.min(
            this.options.capacity,
            bucket.tokens + tokensToAdd
        );

        bucket.lastRefill = now;
    }

    private canConsume(bucket: Bucket): boolean {
        return bucket.tokens >= 1;
    }

    private consumeToken(bucket: Bucket): void {
        bucket.tokens -= 1;
    }

    private calculateRetryAfter(bucket: Bucket): number {
        const missingTokens = 1 - bucket.tokens;

        return missingTokens / this.options.refillRate;
    }
}