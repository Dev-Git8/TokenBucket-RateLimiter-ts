

/**
 * Configuration options for automatic cleanup
 * of idle buckets.
 */

export interface CleanupOptions {
    cleanupInterval: number;
    maxIdleTime: number;
}
