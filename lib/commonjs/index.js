"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NearpayConnect = void 0;
var _LogoutReason = _interopRequireDefault(require("./entities/LogoutReason"));
var _NearPayDevice = _interopRequireDefault(require("./entities/NearPayDevice"));
var _NearpayEventEmitter = _interopRequireWildcard(require("./NearpayEventEmitter"));
var _NearpayConnectTerminal = _interopRequireDefault(require("./NearpayConnectTerminal"));
var _NearpayConnectAuthentication = _interopRequireDefault(require("./NearpayConnectAuthentication"));
var _reactNative = require("react-native");
var _NearpayConnectProxy = _interopRequireDefault(require("./NearpayConnectProxy"));
var _NearpayConnectCore = _interopRequireDefault(require("./ NearpayConnectCore"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class NearpayConnect {
  constructor() {
    this.core = _NearpayConnectCore.default;
    this.auth = _NearpayConnectAuthentication.default;
    this.terminal = _NearpayConnectTerminal.default;
    this.proxy = _NearpayConnectProxy.default;
    this.emitter = _NearpayEventEmitter.default;
    if (_reactNative.Platform.OS === 'ios') {
      this.startListners();
    } else if (_reactNative.Platform.OS === 'android') {
      console.log('Running on Android');
    }
  }
  startListners() {
    this.core.onLogout();
    this.core.onPause();
    this.core.onResume();
    this.core.onDisconnect();
    this.core.onReconnectSuggestion();
    this.core.onStatusChange();
  }
  onProxyPaired(callback) {
    this.emitter.addListener('onProxyPaired', _NearpayEventEmitter.EventType.proxy, result => {
      try {
        callback(result.data);
      } catch (error) {
        console.log(`onProxyPaired ${error}`);
      }
    });
  }
  onProxyUnpaired(callback) {
    this.emitter.addListener('onProxyUnpaired', _NearpayEventEmitter.EventType.proxy, result => {
      try {
        callback(result.data);
      } catch (error) {
        console.log(`onProxyUnpaired ${error}`);
      }
    });
  }
  onProxyConnected(callback) {
    this.emitter.addListener('onProxyConnected', _NearpayEventEmitter.EventType.proxy, result => {
      try {
        callback(result.data);
      } catch (error) {
        console.log(`onProxyConnected ${error}`);
      }
    });
  }
  onProxyDisconnected(callback) {
    this.emitter.addListener('onProxyDisconnected', _NearpayEventEmitter.EventType.proxy, result => {
      try {
        callback(result.data);
      } catch (error) {
        console.log(`onProxyDisconnected ${error}`);
      }
    });
  }
  startDeviceDiscovery(callback) {
    this.core.startDeviceDiscovery();
    this.emitter.addListener('deviceStartDiscovery', _NearpayEventEmitter.EventType.core, result => {
      try {
        const devices = JSON.parse(result).map(device => new _NearPayDevice.default(device.ip, device.port, device.name));
        callback(devices);
      } catch (error) {
        console.log(`startDeviceDiscovery ${error}`);
      }
    });
  }
  onLogout(callback) {
    this.emitter.addListener('onLogout', _NearpayEventEmitter.EventType.core, result => {
      try {
        const response = JSON.parse(result);
        this.terminal.reset();
        const logoutReason = new _LogoutReason.default(response.userToken, response.terminalToken, response.logoutReason);
        callback(logoutReason);
      } catch (error) {
        console.log(`onLogout ${error}`);
      }
    });
  }
  onPause(callback) {
    this.emitter.addListener('onPause', _NearpayEventEmitter.EventType.core, result => {
      try {
        callback(result.data);
      } catch (error) {
        console.log(`onPause ${error}`);
      }
    });
  }
  onResume(callback) {
    this.emitter.addListener('onResume', _NearpayEventEmitter.EventType.core, result => {
      try {
        callback(result.data);
      } catch (error) {
        console.log(`onResume ${error}`);
      }
    });
  }
  onDisconnect(callback) {
    this.emitter.addListener('onDisconnect', _NearpayEventEmitter.EventType.core, result => {
      try {
        callback(result.data);
      } catch (error) {
        console.log(`onDisconnect ${error}`);
      }
    });
  }
  onReconnectSuggestion(callback) {
    this.emitter.addListener('onReconnectSuggestion', _NearpayEventEmitter.EventType.core, result => {
      try {
        callback(result.data);
      } catch (error) {
        console.log(`onReconnectSuggestion ${error}`);
      }
    });
  }
  onStatusChange(callback) {
    this.emitter.addListener('onStatusChange', _NearpayEventEmitter.EventType.core, result => {
      try {
        callback(result);
      } catch (error) {
        console.log(`onStatusChange ${error}`);
      }
    });
  }
  onStartPurchase(callback) {
    this.emitter.addListener('onStartPurchase', _NearpayEventEmitter.EventType.terminal, result => {
      try {
        const purchaseJSON = JSON.parse(JSON.parse(result));
        callback(purchaseJSON);
      } catch (error) {
        console.log(`onStartPurchase ${error}`);
      }
    });
  }
  onStartRefund(callback) {
    this.emitter.addListener('onStartRefund', _NearpayEventEmitter.EventType.terminal, result => {
      try {
        const refundJSON = JSON.parse(JSON.parse(result));
        callback(refundJSON);
      } catch (error) {
        console.log(`onStartRefund ${error}`);
      }
    });
  }
  onStartReverse(callback) {
    this.emitter.addListener('onStartReverse', _NearpayEventEmitter.EventType.terminal, result => {
      try {
        const revereseJSON = JSON.parse(result);
        callback(revereseJSON);
      } catch (error) {
        console.log(`onStartReverse ${error}`);
      }
    });
  }
  onStartReconciliation(callback) {
    this.emitter.addListener('onStartReconciliation', _NearpayEventEmitter.EventType.terminal, result => {
      try {
        const reconciliationJSON = JSON.parse(JSON.parse(result));
        callback(reconciliationJSON);
      } catch (error) {
        console.log(`onStartReconciliation ${error}`);
      }
    });
  }
  onCancelPurchase(callback) {
    this.emitter.addListener('onCancelPurchase', _NearpayEventEmitter.EventType.terminal, result => {
      try {
        const cancelPurchaseJSON = JSON.parse(result);
        callback(cancelPurchaseJSON);
      } catch (error) {
        console.log(`onCancelPurchase ${error}`);
      }
    });
  }
  onCancelRefund(callback) {
    this.emitter.addListener('onCancelRefund', _NearpayEventEmitter.EventType.terminal, result => {
      try {
        const cancelRefundJSON = JSON.parse(result);
        callback(cancelRefundJSON);
      } catch (error) {
        console.log(`onCancelRefund ${error}`);
      }
    });
  }
  onCancelReverse(callback) {
    this.emitter.addListener('onCancelReverse', _NearpayEventEmitter.EventType.terminal, result => {
      try {
        const cancelReverseJSON = JSON.parse(result);
        callback(cancelReverseJSON);
      } catch (error) {
        console.log(`onCancelReverse ${error}`);
      }
    });
  }
  onCancelReconciliation(callback) {
    this.emitter.addListener('onCancelReconciliation', _NearpayEventEmitter.EventType.terminal, result => {
      try {
        const cancelReconciliationJSON = JSON.parse(result);
        callback(cancelReconciliationJSON);
      } catch (error) {
        console.log(`onCancelReconciliation ${error}`);
      }
    });
  }
  onJobStatusChange(callback) {
    this.emitter.addListener('onJobStatusChange', _NearpayEventEmitter.EventType.terminal, result => {
      callback(result);
    });
  }
  onEvent(callback) {
    this.emitter.addListener('onEvent', _NearpayEventEmitter.EventType.terminal, result => {
      callback(result);
    });
  }
  onJobError(callback) {
    this.emitter.addListener('onJobError', _NearpayEventEmitter.EventType.terminal, result => {
      try {
        let errorJSON = JSON.parse(result);
        callback(errorJSON);
      } catch (error) {
        console.log(`onJobError ${error}`);
      }
    });
  }
  onTerminalError(callback) {
    this.emitter.addListener('onTerminalError', _NearpayEventEmitter.EventType.terminal, result => {
      try {
        let errorJSON = JSON.parse(result);
        callback(errorJSON);
      } catch (error) {
        console.log(`onTerminalError ${error}`);
      }
    });
  }
  build(port, environment, networkConfiguration, loadingUi, deviceName) {
    return this.proxy.build(port, environment, networkConfiguration, loadingUi, deviceName);
  }
  showConnection() {
    return this.proxy.showConnection();
  }
  startConnection() {
    return this.proxy.startConnection();
  }
  stopConnection() {
    return this.proxy.stopConnection();
  }
  stopDeviceDiscovery() {
    this.terminal.reset();
    return this.core.stopDeviceDiscovery();
  }
  connect(timeout, ip, port) {
    return this.core.connect(timeout, ip, port);
  }
  disconnect() {
    this.terminal.reset();
    return this.core.disconnect();
  }
  ping(timeout) {
    return this.core.ping(timeout);
  }
  login(method, value, timeout) {
    return this.auth.login(method, value, timeout);
  }
  verify(otp, timeout) {
    return this.auth.verify(otp, timeout);
  }
  getTerminalList(timeout) {
    return this.auth.getTerminalList(timeout);
  }
  logout(timeout) {
    this.terminal.reset();
    return this.auth.logout(timeout);
  }
  connectTerminal(terminalID, timeout) {
    return this.auth.connectTerminal(terminalID, timeout);
  }
  disconnectFromCurrentTerminal(timeout) {
    this.terminal.reset();
    return this.auth.disconnectFromCurrentTerminal(timeout);
  }
  getInfo(timeout) {
    return this.auth.getInfo(timeout);
  }
  purchase(purchaseData) {
    return this.terminal.purchase(purchaseData);
  }
  refund(refundData) {
    return this.terminal.refund(refundData);
  }
  reverse(reverseData) {
    return this.terminal.reverse(reverseData);
  }
  reconcile(reconcileData) {
    return this.terminal.reconcile(reconcileData);
  }
  start(job) {
    return this.terminal.start(job.id, job.method);
  }
  cancel(job) {
    return this.terminal.cancel(job.id, job.method);
  }
  getTransaction(transactionRequest) {
    return this.terminal.getTransaction(transactionRequest);
  }
  getReconciliation(reconciliationRequest) {
    console.log(reconciliationRequest);
    return this.terminal.getReconciliation(reconciliationRequest);
  }
  getTransactionList(transactionListRequest) {
    return this.terminal.getTransactionList(transactionListRequest);
  }
  getReconciliationList(reconciliationListRequest) {
    return this.terminal.getReconciliationList(reconciliationListRequest);
  }
  disconnectTerminal(timeout) {
    this.terminal.reset();
    return this.terminal.disconnect(timeout);
  }
}
exports.NearpayConnect = NearpayConnect;
//# sourceMappingURL=index.js.map