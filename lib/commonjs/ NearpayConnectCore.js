"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _reactNative = require("react-native");
const NearpayConnectCore = _reactNative.NativeModules.NearpayConnectCore;
var _default = exports.default = NearpayConnectCore ? NearpayConnectCore : new Proxy({}, {
  get() {
    throw new Error('The package \'nearpay-connect-core\' doesn\'t seem to be linked...');
  }
});
//# sourceMappingURL= NearpayConnectCore.js.map