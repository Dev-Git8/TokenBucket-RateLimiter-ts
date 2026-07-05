import { BucketStorage } from "./BucketStorage";
import { LockManager } from "./LockManager";
import { Bucket } from "./interfaces/Bucket";
import { ConsumeResult } from "./interfaces/ConsumeResult";
import { Clock } from "../clock/clock";
import { SystemClock } from "../clock/SystemClock";


import { TokenBucketOptions } from "./interfaces/TokenBucketOptions";


export class TokenBucket {
    constructor(
        private readonly storage: BucketStorage,
        private readonly lockManager: LockManager,
        private readonly clock: Clock,
        private readonly options: TokenBucketOptions
    ) {
        
    }
        

    public async consume(key: string): Promise<ConsumeResult> {
        return this.lockManager.withLock(key, async () => {
             const now = Date.now();
            const bucket = this.storage.getOrCreate(
                key,
                this.options.capacity,
                now
            );

           

            bucket.lastAccess = now;

            this.refill(bucket, now);

            if (!this.canConsume(bucket)) {
                return {
                    allowed: false,
                    remainingTokens: Math.floor(bucket.tokens),
                    retryAfter: this.calculateRetryAfter(bucket),
                };
            }

            this.consumeToken(bucket);

            return {
                allowed: true,
                remainingTokens: Math.floor(bucket.tokens),
                retryAfter: null,
            };
        });
    }

    private refill(
        bucket: Bucket,
        now: number
    ): void {
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
        bucket.tokens--;
    }

    private calculateRetryAfter(
        bucket: Bucket
    ): number {
        const missingTokens = 1 - bucket.tokens;

        return missingTokens / this.options.refillRate;
    }
}