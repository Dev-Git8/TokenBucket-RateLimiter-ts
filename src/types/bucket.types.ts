export interface Bucket {
    tokens: number;
    lastRefill: number;
}

export interface ConsumeResult {
    allowed: boolean;
    remainingTokens: number;
    retryAfter?: number;
}