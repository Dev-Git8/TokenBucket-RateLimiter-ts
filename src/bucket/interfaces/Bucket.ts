/**
 * Represents the current state of a token bucket.
 */

export interface Bucket {
    tokens: number;
    lastRefill: number;
    lastAccess: number;
}