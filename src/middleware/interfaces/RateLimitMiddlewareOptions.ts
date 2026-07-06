import { Request, Response } from "express";
/**
 * Configuration options for the Express
 * rate-limiting middleware.
 */
export interface RateLimitMiddlewareOptions {
    /**
     * Generate the rate limit key.
     * Default: req.ip
     */
    keyGenerator?: (req: Request) => string;

    /**
     * Skip rate limiting.
     */
    skip?: (req: Request) => boolean;

    /**
     * Custom rejection handler.
     */
    onRejected?: (
        req: Request,
        res: Response,
        retryAfter: number
    ) => void;
}