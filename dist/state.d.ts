import { IWRequestState } from ".";
export default class WRequestState<T = any> implements IWRequestState<T> {
    private index;
    private cache?;
    private destoryCallback;
    private callback;
    next(): number;
    isValid(index: number): boolean;
    getCache(): Promise<T> | undefined;
    status: {
        loading: boolean;
        error: string;
    };
    fire: {
        load(): void;
        success(data: T): void;
        fail(error: string): string;
        final(): void;
    };
    load(callback: () => void): void;
    success(callback: (data: T) => void): void;
    fail(callback: (error: string) => string | void): void;
    final(callback: () => void): void;
    constructor();
    destory(): void;
}
