import { BucketStorage } from "./BucketStorage";

export class BucketCleanup {

    private cleanupTimer?: NodeJS.Timeout;

    constructor(
        private readonly storage: BucketStorage,
        private readonly cleanupInterval: number,
        private readonly maxIdleTime: number
    ) {}

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

    private cleanup(): void {

        const now = Date.now();

        for (const [key, bucket] of this.storage.entries()) {

            const idleTime = now - bucket.lastAccess;

            if (idleTime > this.maxIdleTime) {

                this.storage.delete(key);

            }

        }

    }

}