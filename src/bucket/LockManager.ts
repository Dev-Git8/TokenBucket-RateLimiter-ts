import { LockProvider } from "./interfaces/LockProvider";

export class LockManager implements LockProvider {

    private readonly locks =
        new Map<string, Promise<void>>();

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