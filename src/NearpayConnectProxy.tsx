import { NativeModules } from 'react-native';

export interface INearpayConnectProxy {
  showConnection(): Promise<any>;
  startConnection(): Promise<any>;
  stopConnection(): Promise<any>;
  build(
    port: number,
    environment: string,
    networkConfiguration: string,
    loadingUi: boolean,
    deviceName: string
  ): Promise<any>;
}

const NearpayConnectProxy =
  NativeModules.NearpayConnectCoreModule as INearpayConnectProxy;
export default NearpayConnectProxy
  ? NearpayConnectProxy
  : new Proxy(
      {},
      {
        get() {
          throw new Error(
            "The package 'nearpay-connect-core-proxy' doesn't seem to be linked..."
          );
        },
      }
    );
