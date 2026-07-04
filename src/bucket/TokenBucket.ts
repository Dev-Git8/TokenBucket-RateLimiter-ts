import { BucketStorage } from "./BucketStorage.js";
import { ConsumeResult } from "../types/bucket.types.js";

export class TokenBucket {
    constructor(
        private readonly storage: BucketStorage,
        private readonly capacity: number,
        private readonly refillRate: number
    ) {}

    async consume(key: string): Promise<ConsumeResult> {
          return this.storage.consume( key,
            this.capacity,
            this.refillRate
        );
    }
}