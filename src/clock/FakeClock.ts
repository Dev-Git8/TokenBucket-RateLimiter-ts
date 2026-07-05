import { Clock } from "./clock";

export class FakeClock implements Clock {
    constructor(
        private currentTime = 0
    ) {}

    public now(): number {
        return this.currentTime;
    }

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