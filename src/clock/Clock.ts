

/**
 * Represents a source of time.
 *
 * Allows the rate limiter to use either the system
 * clock or a controllable fake clock for testing.
 */


export interface Clock {
    /**
 * Returns the current time in milliseconds.
 */
    now(): number;
}