import { Request, Response, NextFunction } from "express";

import { RateLimiter } from "../bucket";
import { RateLimitMiddlewareOptions } from "./interfaces/RateLimitMiddlewareOptions";
/**
 * Creates an Express middleware that applies
 * rate limiting using the supplied RateLimiter.
 *
 * @param limiter Rate limiter implementation.
 * @param options Middleware configuration.
 * @returns Express middleware function.
 */
export function rateLimit(
    limiter: RateLimiter,
    options: RateLimitMiddlewareOptions = {}
) {
    const keyGenerator =
        options.keyGenerator ??
        ((req: Request) => req.ip ?? "anonymous");

    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        if (options.skip?.(req)) {
            next();
            return;
        }

        const result = await limiter.consume(
            keyGenerator(req)
        );
res.setHeader(
    "X-RateLimit-Limit",
    result.limit
);

res.setHeader(
    "X-RateLimit-Remaining",
    result.remainingTokens
);

res.setHeader(
    "X-RateLimit-Reset",
    Math.ceil(result.resetAfter)
);

        if (options.onRejected) {
            options.onRejected(
                req,
                res,
                result.retryAfter ?? 0
            );
            return;
        }

        res.status(429).json({
            message: "Too Many Requests",
            retryAfter: result.retryAfter,
        });
    };
}