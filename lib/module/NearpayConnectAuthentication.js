import { NativeModules } from 'react-native';
const NearpayConnectAuth = NativeModules.NearpayConnectAuthentication;
export default NearpayConnectAuth ? NearpayConnectAuth : new Proxy({}, {
  get() {
    throw new Error('The package \'nearpay-connect-core\' doesn\'t seem to be linked...');
  }
});
//# sourceMappingURL=NearpayConnectAuthentication.js.map