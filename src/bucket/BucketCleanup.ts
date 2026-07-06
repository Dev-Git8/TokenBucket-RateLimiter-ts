import { BucketStore } from "./interfaces/BucketStore";
import { Clock } from "../clock";
/**
 * Periodically removes idle buckets from storage.
 *
 * This prevents memory usage from growing indefinitely
 * in long-running applications.
 */
export class BucketCleanup {
    private cleanupTimer?: NodeJS.Timeout;

    constructor(
        private readonly storage: BucketStore,
        private readonly clock: Clock,
        private readonly cleanupInterval: number,
        private readonly maxIdleTime: number
    ) {}



    /**
 * Starts the background cleanup timer.
 */
    public start(): void {
        if (this.cleanupTimer) {
            return;
        }

        this.cleanupTimer = setInterval(() => {
            this.cleanup();
        }, this.cleanupInterval);

        this.cleanupTimer.unref();
    }

    public stop(): void {
        if (!this.cleanupTimer) {
            return;
        }

        clearInterval(this.cleanupTimer);
        this.cleanupTimer = undefined;
    }
/**
 * Removes all buckets that have been idle longer
 * than the configured maximum idle time.
 */
    public cleanup(): void {
        const now = this.clock.now();

        for (const [key, bucket] of this.storage.entries()) {
            if (now - bucket.lastAccess > this.maxIdleTime) {
                this.storage.delete(key);
            }
        }
    }
}