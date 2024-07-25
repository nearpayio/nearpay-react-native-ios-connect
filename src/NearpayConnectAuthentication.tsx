
import { NativeModules } from 'react-native';

export interface INearpayConnectAuthentication {
  login(method: string, value: string, timeout: number): Promise<any>;
  verify(otp: string, timeout: number): Promise<any>;
  getTerminalList(timeout: number): Promise<any>;
  logout(timeout: number): Promise<boolean>;
  connectTerminal(terminalID: string, timeout: number): Promise<any>;
  disconnectFromCurrentTerminal(timeout: number): Promise<boolean>;
  getInfo(timeout: number): Promise<any>;
}

const NearpayConnectAuth = NativeModules.NearpayConnectAuthentication as INearpayConnectAuthentication;

export default NearpayConnectAuth ? NearpayConnectAuth : new Proxy(
  {},
  {
    get() {
      throw new Error('The package \'nearpay-connect-core\' doesn\'t seem to be linked...');
    },
  }
);


