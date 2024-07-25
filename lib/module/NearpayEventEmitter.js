import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
class NearpayEventEmitter {
  constructor() {
    if (Platform.OS === 'ios') {
      this.coreEmitter = new NativeEventEmitter(NativeModules.NearpayConnectCore);
      this.terminalEmitter = new NativeEventEmitter(NativeModules.NearpayConnectTerminal);
    } else if (Platform.OS === 'android') {
      this.proxyEmitter = new NativeEventEmitter(NativeModules.NearpayConnectCoreModule);
    }
  }
  addListener(eventName, type, callback) {
    if (Platform.OS === 'ios') {
      if (type == EventType.core) {
        var _this$coreEmitter;
        (_this$coreEmitter = this.coreEmitter) === null || _this$coreEmitter === void 0 || _this$coreEmitter.addListener(eventName, callback);
      } else if (type == EventType.terminal) {
        var _this$terminalEmitter;
        (_this$terminalEmitter = this.terminalEmitter) === null || _this$terminalEmitter === void 0 || _this$terminalEmitter.addListener(eventName, callback);
      }
    } else if (Platform.OS === 'android') {
      if (type == EventType.proxy) {
        var _this$proxyEmitter;
        (_this$proxyEmitter = this.proxyEmitter) === null || _this$proxyEmitter === void 0 || _this$proxyEmitter.addListener(eventName, callback);
      }
    }
  }
}
export default new NearpayEventEmitter();
export let EventType = /*#__PURE__*/function (EventType) {
  EventType[EventType["terminal"] = 0] = "terminal";
  EventType[EventType["core"] = 1] = "core";
  EventType[EventType["proxy"] = 2] = "proxy";
  return EventType;
}({});
//# sourceMappingURL=NearpayEventEmitter.js.map