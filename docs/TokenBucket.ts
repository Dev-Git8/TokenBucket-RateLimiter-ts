/**
 * A production-grade in-memory Token Bucket rate limiter.
 *
 * This implementation uses the Token Bucket algorithm with
 * fractional token refilling, per-key asynchronous locking,
 * and automatic cleanup of idle buckets.
 *
 * @example
 * ```ts
 * const limiter = new TokenBucket({
 *   capacity: 10,
 *   refillRate: 5,
 *   cleanup: {
 *     cleanupInterval: 60000,
 *     maxIdleTime: 300000,
 *   },
 * });
 * ```
 */
export class TokenBucket implements RateLimiter {
    Constructor
    /**
 * Creates a new Token Bucket rate limiter.
 *
 * @param options Configuration options for the rate limiter.
 */

    /**
 * Attempts to consume a single token from the bucket
 * associated with the supplied key.
 *
 * If sufficient tokens are available, one token is consumed
 * and the request is allowed. Otherwise, the request is
 * rejected and the required retry time is returned.
 *
 * @param key Unique identifier for the bucket.
 * @returns The result of the consume operation.
 */

    /**
 * Stops the background cleanup task and releases
 * any timer resources held by the rate limiter.
 */
}