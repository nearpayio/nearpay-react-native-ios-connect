declare class NearpayEventEmitter {
    private coreEmitter?;
    private terminalEmitter?;
    private proxyEmitter?;
    constructor();
    addListener<T>(eventName: string, type: EventType, callback: (data: T) => void): void;
}
declare const _default: NearpayEventEmitter;
export default _default;
export declare enum EventType {
    terminal = 0,
    core = 1,
    proxy = 2
}
//# sourceMappingURL=NearpayEventEmitter.d.ts.map