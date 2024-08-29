export interface INearpayConnectCore {
    startDeviceDiscovery(): Promise<void>;
    stopDeviceDiscovery(): Promise<boolean>;
    connect(timeout: number, ip: string, port: string): Promise<boolean>;
    disconnect(): Promise<boolean>;
    ping(timeout: number): Promise<boolean>;
    onLogout(): Promise<void>;
    onPause(): Promise<void>;
    onResume(): Promise<void>;
    onDisconnect(): Promise<void>;
    onReconnectSuggestion(): Promise<void>;
    onStatusChange(): Promise<void>;
}
declare const _default: any;
export default _default;
//# sourceMappingURL=%20NearpayConnectCore.d.ts.map