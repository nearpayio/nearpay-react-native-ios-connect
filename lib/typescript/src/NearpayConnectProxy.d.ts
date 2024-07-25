export interface INearpayConnectProxy {
    showConnection(): Promise<any>;
    startConnection(): Promise<any>;
    stopConnection(): Promise<any>;
    build(port: number, environment: string, networkConfiguration: string, loadingUi: boolean, deviceName: string): Promise<any>;
}
declare const _default: {};
export default _default;
//# sourceMappingURL=NearpayConnectProxy.d.ts.map