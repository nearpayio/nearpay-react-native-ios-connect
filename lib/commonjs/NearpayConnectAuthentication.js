"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _reactNative = require("react-native");
const NearpayConnectAuth = _reactNative.NativeModules.NearpayConnectAuthentication;
var _default = exports.default = NearpayConnectAuth ? NearpayConnectAuth : new Proxy({}, {
  get() {
    throw new Error('The package \'nearpay-connect-core\' doesn\'t seem to be linked...');
  }
});
//# sourceMappingURL=NearpayConnectAuthentication.js.map