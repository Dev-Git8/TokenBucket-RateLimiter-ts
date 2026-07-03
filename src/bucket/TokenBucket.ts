import { Bucket, ConsumeResult } from "../types/bucket.types.js"
import { BucketStorage } from "../storage/BucketStorage.js";



export class TokenBucket {
    

    constructor(
         private readonly storage: BucketStorage,
        private readonly capacity: number,
        private readonly refillRate: number
    ){}

    private async getBucket(key: string):Promise<Bucket> {
       
    let bucket = await this.storage.get(key);

    if (!bucket) {

        bucket = {
            tokens: this.capacity,
            lastRefill: Date.now(),
        };

        await this.storage.set(key, bucket);
    }

    return bucket;
}

    private refill(bucket: Bucket): void{
        const now = Date.now();

        const elapsedTime = (now - bucket.lastRefill) / 1000;

        const newTokens = elapsedTime * this.refillRate;

        bucket.tokens = Math.min(
            this.capacity, // 10
            bucket.tokens + newTokens // 4 + 6
        );

        bucket.lastRefill = now;
    }

    public async consume( key: string): Promise<ConsumeResult> {
        const bucket = await this.getBucket(key);

        this.refill(bucket);
        await this.storage.set(key, bucket);

        if (bucket.tokens >= 1){
            bucket.tokens--;
            
        await this.storage.set(key, bucket);

            return {
                allowed: true,
                remainingTokens: Math.floor(bucket.tokens),
            };
        }

        const retryAfter = Number(
    ((1 - bucket.tokens) / this.refillRate).toFixed(2) // 1 - 0.6 / 2
);

        return {
            allowed: false,
            remainingTokens:0,
            retryAfter,
        };
    }






}