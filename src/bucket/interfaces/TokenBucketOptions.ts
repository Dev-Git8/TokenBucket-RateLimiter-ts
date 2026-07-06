import { Clock } from "../../clock/clock";
import { BucketStore } from "./BucketStore";
import { LockProvider } from "./LockProvider";
import { CleanupOptions } from "./CleanupOptions";
import { RateLimiterOptions } from "../../common";
/**
 * Configuration options for the TokenBucket
 * rate limiter.
 */
export interface TokenBucketOptions extends RateLimiterOptions {
    capacity: number;
    refillRate: number;
    cleanup: CleanupOptions;

    storage?: BucketStore;
    lockManager?: LockProvider;
    clock?: Clock;
}