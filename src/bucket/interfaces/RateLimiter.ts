import { ConsumeResult } from "./ConsumeResult";
/**
 * Common interface implemented by all
 * rate limiter implementations.
 */
export interface RateLimiter {
    consume(key: string): Promise<ConsumeResult>;
}