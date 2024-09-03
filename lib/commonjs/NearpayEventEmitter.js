"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.EventType = void 0;
var _reactNative = require("react-native");
class NearpayEventEmitter {
  listeners = {};
  constructor() {
    if (_reactNative.Platform.OS === 'ios') {
      this.coreEmitter = new _reactNative.NativeEventEmitter(_reactNative.NativeModules.NearpayConnectCore);
      this.terminalEmitter = new _reactNative.NativeEventEmitter(_reactNative.NativeModules.NearpayConnectTerminal);
    } else if (_reactNative.Platform.OS === 'android') {
      this.proxyEmitter = new _reactNative.NativeEventEmitter(_reactNative.NativeModules.NearpayConnectCoreModule);
    }
  }
  addListener(eventName, type, callback) {
    // Remove existing listener if it exists
    this.removeListener(eventName);
    if (_reactNative.Platform.OS === 'ios') {
      if (type === EventType.core) {
        var _this$coreEmitter;
        (_this$coreEmitter = this.coreEmitter) === null || _this$coreEmitter === void 0 || _this$coreEmitter.addListener(eventName, callback);
        this.listeners[eventName] = () => {
          var _this$coreEmitter2;
          return (_this$coreEmitter2 = this.coreEmitter) === null || _this$coreEmitter2 === void 0 ? void 0 : _this$coreEmitter2.removeAllListeners(eventName);
        };
      } else if (type === EventType.terminal) {
        var _this$terminalEmitter;
        (_this$terminalEmitter = this.terminalEmitter) === null || _this$terminalEmitter === void 0 || _this$terminalEmitter.addListener(eventName, callback);
        this.listeners[eventName] = () => {
          var _this$terminalEmitter2;
          return (_this$terminalEmitter2 = this.terminalEmitter) === null || _this$terminalEmitter2 === void 0 ? void 0 : _this$terminalEmitter2.removeAllListeners(eventName);
        };
      }
    } else if (_reactNative.Platform.OS === 'android') {
      if (type === EventType.proxy) {
        var _this$proxyEmitter;
        (_this$proxyEmitter = this.proxyEmitter) === null || _this$proxyEmitter === void 0 || _this$proxyEmitter.addListener(eventName, callback);
        this.listeners[eventName] = () => {
          var _this$proxyEmitter2;
          return (_this$proxyEmitter2 = this.proxyEmitter) === null || _this$proxyEmitter2 === void 0 ? void 0 : _this$proxyEmitter2.removeAllListeners(eventName);
        };
      }
    }
  }
  removeListener(eventName) {
    const listener = this.listeners[eventName];
    if (listener) {
      listener(); // Remove the existing listener
      delete this.listeners[eventName]; // Delete the reference
    }
  }
}
var _default = exports.default = new NearpayEventEmitter();
let EventType = exports.EventType = /*#__PURE__*/function (EventType) {
  EventType[EventType["terminal"] = 0] = "terminal";
  EventType[EventType["core"] = 1] = "core";
  EventType[EventType["proxy"] = 2] = "proxy";
  return EventType;
}({});
//# sourceMappingURL=NearpayEventEmitter.js.map