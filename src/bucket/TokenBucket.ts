import { Bucket, ConsumeResult } from "../types/bucket.types.js"


export class TokenBucket {
    private buckets = new Map<string, Bucket>();

    constructor(
        private readonly capacity: number,
        private readonly refillRate: number
    ){}

    private getBucket(key: string): Bucket{
        let bucket = this.buckets.get(key);

        if(!bucket){
            bucket = {
                tokens: this.capacity,
                lastRefill: Date.now(),
            };

            this.buckets.set(key, bucket);
        }

        return bucket;
    }

    private refill(bucket: Bucket): void{
        const now = Date.now();

        const elapsedTime = (now - bucket.lastRefill) / 1000;

        const newTokens = elapsedTime * this.refillRate;

        bucket.tokens = Math.min(
            this.capacity,
            bucket.tokens + newTokens
        );

        bucket.lastRefill = now;
    }

    public consume (key: string ): ConsumeResult {
        const bucket = this.getBucket(key);

        this.refill(bucket);

        if (bucket.tokens >= 1){
            bucket.tokens--;

            return {
                allowed: true,
                remainingTokens: Math.floor(bucket.tokens),
            };
        }

        const retryAfter = Number(
    ((1 - bucket.tokens) / this.refillRate).toFixed(2)
);

        return {
            allowed: false,
            remainingTokens:0,
            retryAfter,
        };
    }






}