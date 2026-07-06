

/**
 * Result returned after attempting to consume
 * a token from the rate limiter.
 */
export interface ConsumeResult {
    allowed: boolean;
    remainingTokens: number;
    retryAfter: number | null;

    limit: number;
    resetAfter: number;
}