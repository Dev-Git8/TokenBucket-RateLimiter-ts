import { describe, expect, it } from "vitest";

import {
    BucketCleanup,
    BucketStorage,
    
} from "../src/bucket";
import { FakeClock } from "../src/clock";

describe("BucketCleanup", () => {
    it("should remove idle buckets", () => {
        const storage = new BucketStorage();
        const clock = new FakeClock();

        storage.getOrCreate("user", 5, 0);

        clock.advance(10000);

        const cleanup = new BucketCleanup(
            storage,
            clock,
            1000,
            5000
        );

        cleanup.cleanup();

        expect(storage.size()).toBe(0);
    });

    it("should keep active buckets", () => {
        const storage = new BucketStorage();
        const clock = new FakeClock();

        storage.getOrCreate("user", 5, 0);

        clock.advance(1000);

        const cleanup = new BucketCleanup(
            storage,
            clock,
            1000,
            5000
        );

        cleanup.cleanup();

        expect(storage.size()).toBe(1);
    });

    it("should allow start and stop", () => {
        const storage = new BucketStorage();
        const clock = new FakeClock();

        const cleanup = new BucketCleanup(
            storage,
            clock,
            1000,
            5000
        );

        cleanup.start();
        cleanup.stop();

        expect(true).toBe(true);
    });
});