import { Clock } from "./Clock";
/**
 * Controllable clock implementation used for
 * deterministic unit testing.
 */
export class FakeClock implements Clock {
    constructor(
        private currentTime = 0
    ) {}

    public now(): number {
        return this.currentTime;
    }
/**
 * Advances the clock by the specified number
 * of milliseconds.
 *
 * @param milliseconds Amount of time to advance.
 */
    public advance(milliseconds: number): void {
        this.currentTime += milliseconds;
    }

    public set(milliseconds: number): void {
        this.currentTime = milliseconds;
    }

    public reset(): void {
        this.currentTime = 0;
    }
  
}