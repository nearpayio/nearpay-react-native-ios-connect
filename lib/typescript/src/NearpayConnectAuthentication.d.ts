export interface INearpayConnectAuthentication {
    login(method: string, value: string, timeout: number): Promise<any>;
    verify(otp: string, timeout: number): Promise<any>;
    getTerminalList(timeout: number): Promise<any>;
    logout(timeout: number): Promise<boolean>;
    connectTerminal(terminalID: string, timeout: number): Promise<any>;
    disconnectFromCurrentTerminal(timeout: number): Promise<boolean>;
    getInfo(timeout: number): Promise<any>;
}
declare const _default: {};
export default _default;
//# sourceMappingURL=NearpayConnectAuthentication.d.ts.map