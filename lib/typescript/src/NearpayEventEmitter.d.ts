declare class NearpayEventEmitter {
    private coreEmitter?;
    private terminalEmitter?;
    private proxyEmitter?;
    private listeners;
    constructor();
    addListener<T>(eventName: string, type: EventType, callback: (data: T) => void): void;
    removeListener(eventName: string): void;
}
declare const _default: NearpayEventEmitter;
export default _default;
export declare enum EventType {
    terminal = 0,
    core = 1,
    proxy = 2
}
//# sourceMappingURL=NearpayEventEmitter.d.ts.map