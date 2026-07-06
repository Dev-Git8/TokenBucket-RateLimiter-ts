import { describe, expect, it } from "vitest";

import {
    FakeClock,
    SystemClock,
} from "../src/clock";

describe("FakeClock", () => {
    it("should start at zero", () => {
        const clock = new FakeClock();

        expect(clock.now()).toBe(0);
    });

    it("should advance time", () => {
        const clock = new FakeClock();

        clock.advance(2500);

        expect(clock.now()).toBe(2500);
    });
});

describe("SystemClock", () => {
    it("should return current time", () => {
        const clock = new SystemClock();

        expect(clock.now()).toBeGreaterThan(0);
    });
});