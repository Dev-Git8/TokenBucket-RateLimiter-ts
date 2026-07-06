import { describe, it, expect, beforeEach } from "vitest";

import {
    TokenBucket,
    
} from "../src/bucket/TokenBucket";
import { FakeClock } from "../src/clock";

describe("TokenBucket", () => {
    let clock: FakeClock;
    let limiter: TokenBucket;

    beforeEach(() => {
        clock = new FakeClock();

        limiter = new TokenBucket({
            capacity: 5,
            refillRate: 1,
            cleanup: {
                cleanupInterval: 60_000,
                maxIdleTime: 300_000,
            },
            clock,
        });
    });

    it("should create a full bucket", async () => {
        const result = await limiter.consume("user-1");

        expect(result.allowed).toBe(true);
        expect(result.remainingTokens).toBe(4);
    });

    it("should consume tokens", async () => {
        await limiter.consume("user-1");

        const result = await limiter.consume("user-1");

        expect(result.allowed).toBe(true);
        expect(result.remainingTokens).toBe(3);
    });

    it("should reject when bucket is empty", async () => {
        for (let i = 0; i < 5; i++) {
            await limiter.consume("user-1");
        }

        const result = await limiter.consume("user-1");

        expect(result.allowed).toBe(false);
        expect(result.retryAfter).toBe(1);
    });

    it("should refill after time passes", async () => {
        for (let i = 0; i < 5; i++) {
            await limiter.consume("user-1");
        }

        clock.advance(1000);

        const result = await limiter.consume("user-1");

        expect(result.allowed).toBe(true);
        expect(result.remainingTokens).toBe(0);
    });

    it("should never exceed capacity", async () => {
        clock.advance(60_000);

        const result = await limiter.consume("user-1");

        expect(result.remainingTokens).toBe(4);
    });

    it("should isolate buckets per user", async () => {
        await limiter.consume("user-1");

        const result = await limiter.consume("user-2");

        expect(result.remainingTokens).toBe(4);
    });

    it("should refill fractional tokens correctly", async () => {
    for (let i = 0; i < 5; i++) {
        await limiter.consume("user");
    }

    clock.advance(500);

    const result = await limiter.consume("user");

    expect(result.allowed).toBe(false);
    expect(result.retryAfter).toBeCloseTo(0.5);
});

it("should calculate retryAfter accurately", async () => {
    for (let i = 0; i < 5; i++) {
        await limiter.consume("user");
    }

    clock.advance(250);

    const result = await limiter.consume("user");

    expect(result.allowed).toBe(false);
    expect(result.retryAfter).toBeCloseTo(0.75);
});

it("should refill back to capacity", async () => {
    for (let i = 0; i < 5; i++) {
        await limiter.consume("user");
    }

    clock.advance(10000);

    const result = await limiter.consume("user");

    expect(result.allowed).toBe(true);
    expect(result.remainingTokens).toBe(4);
});
it("should keep users completely independent", async () => {
    for (let i = 0; i < 5; i++) {
        await limiter.consume("user1");
    }

    const result = await limiter.consume("user2");

    expect(result.allowed).toBe(true);
    expect(result.remainingTokens).toBe(4);
});
it("should handle concurrent requests safely", async () => {
    const results = await Promise.all(
        Array.from({ length: 20 }, () =>
            limiter.consume("user")
        )
    );

    const allowed = results.filter(r => r.allowed);

    expect(allowed).toHaveLength(5);
});
it("should allow only capacity concurrent requests", async () => {
    const requests = Array.from(
        { length: 100 },
        () => limiter.consume("user")
    );

    const results = await Promise.all(requests);

    const allowed = results.filter(r => r.allowed);

    expect(allowed).toHaveLength(5);
});
it("should keep buckets isolated under concurrency", async () => {
    const user1 = Promise.all(
        Array.from({ length: 10 }, () =>
            limiter.consume("user1")
        )
    );

    const user2 = Promise.all(
        Array.from({ length: 10 }, () =>
            limiter.consume("user2")
        )
    );

    const [r1, r2] = await Promise.all([user1, user2]);

    expect(r1.filter(x => x.allowed)).toHaveLength(5);
    expect(r2.filter(x => x.allowed)).toHaveLength(5);
});
});