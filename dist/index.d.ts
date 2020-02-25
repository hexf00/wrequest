declare type success<T> = (data: T) => void | Promise<void>;
declare type fail = (error: string) => string | void;
declare type final = () => void;
declare type load = () => void;
declare type transform<T, RT> = (data: T, action: {
    fail: (error: string) => Error;
}) => RT | Error;
declare type validate<T> = (data: T) => void | string | Promise<string> | Promise<void> | boolean;
declare type generator<T> = () => Promise<T>;
export interface IWRequestState<T = any> {
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
}
export default class WRequest<T> {
    private generator;
    private dataHandlers;
    private promiseTransforms;
    private failCallback;
    private finalCallback;
    private loadCallback;
    debug: {
        log(): WRequest<T>;
        delay(time?: number): WRequest<T>;
        success(data: T): WRequest<T>;
        fail(error: string): WRequest<T>;
    };
    status: {
        loading(callback: (loading: boolean) => void): WRequest<T>;
        error(callback: (error: string) => string | void): WRequest<T>;
    };
    private myState?;
    constructor(generator: generator<T>);
    private transformPromise;
    private query;
    private handle;
    private destory;
    load(callback: load): this;
    map<RT>(callback: transform<T, RT>): WRequest<RT>;
    transform<RT>(callback: transform<T, RT>): WRequest<RT>;
    success(callback: success<T>): this;
    fail(callback: fail): this;
    final(callback: final): this;
    validate(callback: validate<T>): this;
    state(state: IWRequestState<T>): this;
}
export {};
