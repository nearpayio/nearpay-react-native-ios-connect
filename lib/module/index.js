import { NativeModules } from 'react-native';
const NearpayConnectCore = NativeModules.NearpayConnectCore;
export default NearpayConnectCore ? NearpayConnectCore : new Proxy({}, {
  get() {
    throw new Error('The package \'nearpay-connect-core\' doesn\'t seem to be linked...');
  }
});
//# sourceMappingURL=index.js.map