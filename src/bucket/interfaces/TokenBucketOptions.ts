import { Clock } from "../../clock/Clock";
import { BucketStore } from "./BucketStore";
import { LockProvider } from "./LockProvider";

export interface TokenBucketOptions {
    capacity: number;
    refillRate: number;

    storage?: BucketStore;
    lockManager?: LockProvider;
    clock?: Clock;
}