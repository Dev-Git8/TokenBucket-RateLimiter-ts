export interface LockProvider {
    withLock<T>(
        key: string,
        operation: () => Promise<T>
    ): Promise<T>;
}