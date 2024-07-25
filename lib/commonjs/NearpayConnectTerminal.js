"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _reactNative = require("react-native");
const NearpayConnectTerminal = _reactNative.NativeModules.NearpayConnectTerminal;
var _default = exports.default = NearpayConnectTerminal ? NearpayConnectTerminal : new Proxy({}, {
  get() {
    throw new Error('The package \'nearpay-connect-core\' doesn\'t seem to be linked...');
  }
});
//# sourceMappingURL=NearpayConnectTerminal.js.map