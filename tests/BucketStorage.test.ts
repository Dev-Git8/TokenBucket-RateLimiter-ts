import { describe, expect, it } from "vitest";

import { BucketStorage } from "../src/bucket/BucketStorage";

describe("BucketStorage", () => {
    it("should create a bucket", () => {
        const storage = new BucketStorage();

        const bucket = storage.getOrCreate("user", 5, 0);

        expect(bucket.tokens).toBe(5);
        expect(storage.size()).toBe(1);
    });

    it("should return the same bucket", () => {
        const storage = new BucketStorage();

        const bucket1 = storage.getOrCreate("user", 5, 0);
        const bucket2 = storage.getOrCreate("user", 5, 1000);

        expect(bucket1).toBe(bucket2);
    });

    it("should delete a bucket", () => {
        const storage = new BucketStorage();

        storage.getOrCreate("user", 5, 0);

        storage.delete("user");

        expect(storage.size()).toBe(0);
    });

    it("should store multiple buckets", () => {
        const storage = new BucketStorage();

        storage.getOrCreate("a", 5, 0);
        storage.getOrCreate("b", 5, 0);
        storage.getOrCreate("c", 5, 0);

        expect(storage.size()).toBe(3);
    });

    it("should iterate over buckets", () => {
        const storage = new BucketStorage();

        storage.getOrCreate("a", 5, 0);
        storage.getOrCreate("b", 5, 0);

        expect([...storage.entries()]).toHaveLength(2);
    });
});