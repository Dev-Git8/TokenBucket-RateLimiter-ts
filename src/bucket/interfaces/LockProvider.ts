
/**
 * Contract for lock providers used to ensure
 * safe concurrent access to buckets.
 */

export interface LockProvider {
    withLock<T>(
        key: string,
        fn: () => Promise<T>
    ): Promise<T>;
}