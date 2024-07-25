import { NativeModules } from 'react-native';
const NearpayConnectProxy = NativeModules.NearpayConnectCoreModule;
export default NearpayConnectProxy ? NearpayConnectProxy : new Proxy({}, {
  get() {
    throw new Error("The package 'nearpay-connect-core-proxy' doesn't seem to be linked...");
  }
});
//# sourceMappingURL=NearpayConnectProxy.js.map