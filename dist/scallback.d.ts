export default class SCallback<T extends (...args: any[]) => any = () => void> {
    private callbacks;
    private onceCallbacks;
    constructor(callback?: T);
    set(callback: T): this;
    clear(): this;
    once(callback: T): this;
    add(callback: T): this;
    bind(callback: T): () => void;
    remove(callback: T): this;
    fire(...args: Parameters<T>): this;
    destory(): void;
}
