import { LockProvider } from "./interfaces/LockProvider";



/**
 * Provides asynchronous per-key mutual exclusion.
 *
 * Ensures that concurrent operations on the same
 * bucket execute sequentially.
 */
export class LockManager implements LockProvider {

    private readonly locks =
        new Map<string, Promise<void>>();



/**
 * Executes a function while holding the lock
 * associated with the supplied key.
 *
 * @param key Lock identifier.
 * @param fn Function to execute.
 * @returns The result returned by the supplied function.
 */
    public async withLock<T>(
        key: string,
        operation: () => Promise<T>
    ): Promise<T> {

        const previousLock =
            this.locks.get(key);

        let release!: () => void;

        const currentLock =
            new Promise<void>((resolve) => {

                release = resolve;

            });

        this.locks.set(
            key,
            currentLock
        );

        if (previousLock) {
            await previousLock;
        }

        try {

            return await operation();

        } finally {

            release();

            if (
                this.locks.get(key) ===
                currentLock
            ) {

                this.locks.delete(key);

            }

        }

    }

}