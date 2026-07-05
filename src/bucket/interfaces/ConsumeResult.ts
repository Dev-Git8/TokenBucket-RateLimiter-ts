export interface ConsumeResult {
    allowed: boolean;
    remainingTokens: number;
    retryAfter: number | null;
}