import { Clock } from "./Clock";
/**
 * Clock implementation backed by the system clock.
 */
export class SystemClock implements Clock {
    public now(): number {
        return Date.now();
    }
}