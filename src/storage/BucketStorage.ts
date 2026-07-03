import { Bucket } from "../types/bucket.types.js"

export interface BucketStorage {
    get(key: string): Promise< Bucket | null>;

    set(key: string , bucket: Bucket): Promise<void>;
    
}