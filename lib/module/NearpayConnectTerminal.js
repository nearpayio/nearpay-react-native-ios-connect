import { NativeModules } from 'react-native';
const NearpayConnectTerminal = NativeModules.NearpayConnectTerminal;
export default NearpayConnectTerminal ? NearpayConnectTerminal : new Proxy({}, {
  get() {
    throw new Error('The package \'nearpay-connect-core\' doesn\'t seem to be linked...');
  }
});
//# sourceMappingURL=NearpayConnectTerminal.js.map