"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _reactNative = require("react-native");
const NearpayConnectProxy = _reactNative.NativeModules.NearpayConnectCoreModule;
var _default = exports.default = NearpayConnectProxy ? NearpayConnectProxy : new Proxy({}, {
  get() {
    throw new Error("The package 'nearpay-connect-core-proxy' doesn't seem to be linked...");
  }
});
//# sourceMappingURL=NearpayConnectProxy.js.map