
import { NativeModules } from 'react-native';

export interface INearpayConnectCore {
  startDeviceDiscovery(): Promise<void>;
  stopDeviceDiscovery(): Promise<boolean>;
  connect(timeout: number, ip: string, port: string): Promise<boolean>;
  disconnect(): Promise<boolean>;
  ping(timeout: number): Promise<boolean>;
  onLogout():  Promise<void>;
  onPause():  Promise<void>;
  onResume():  Promise<void>;
  onDisconnect():  Promise<void>;
  onReconnectSuggestion():  Promise<void>;
  onStatusChange():  Promise<void>;
}

const NearpayConnectCore = NativeModules.NearpayConnectCore;
export default NearpayConnectCore ? NearpayConnectCore : new Proxy(
  {},
  {
    get() {
      throw new Error('The package \'nearpay-connect-core\' doesn\'t seem to be linked...');
    },
  }
);