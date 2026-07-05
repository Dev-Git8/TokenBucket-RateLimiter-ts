import { Clock } from "./clock";

export class SystemClock implements Clock {
    public now(): number {
        return Date.now();
    }
}