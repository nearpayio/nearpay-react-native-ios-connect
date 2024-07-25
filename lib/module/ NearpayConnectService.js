import NearpayConnectCore from 'react-native-nearpay-connect-core';
import LogoutResponse from './entities/LogoutReason';
import DeviceInfo from './entities/NearPayDevice';
import NearpayEventEmitter, { EventType } from './NearpayEventEmitter';
import NearpayConnectTerminal from './NearpayConnectTerminal';
import NearpayConnectAuth from './NearpayConnectAuthentication';
import { Platform } from 'react-native';
import NearpayConnectProxy from './NearpayConnectProxy';
export class NearpayConnect {
  constructor() {
    this.core = NearpayConnectCore;
    this.auth = NearpayConnectAuth;
    this.terminal = NearpayConnectTerminal;
    this.proxy = NearpayConnectProxy;
    this.emitter = NearpayEventEmitter;
    if (Platform.OS === 'ios') {
      this.startListners();
    } else if (Platform.OS === 'android') {
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
    this.emitter.addListener('onProxyPaired', EventType.proxy, result => {
      try {
        callback(result.data);
      } catch (error) {
        console.log(`onProxyPaired ${error}`);
      }
    });
  }
  onProxyUnpaired(callback) {
    this.emitter.addListener('onProxyUnpaired', EventType.proxy, result => {
      try {
        callback(result.data);
      } catch (error) {
        console.log(`onProxyUnpaired ${error}`);
      }
    });
  }
  onProxyConnected(callback) {
    this.emitter.addListener('onProxyConnected', EventType.proxy, result => {
      try {
        callback(result.data);
      } catch (error) {
        console.log(`onProxyConnected ${error}`);
      }
    });
  }
  onProxyDisconnected(callback) {
    this.emitter.addListener('onProxyDisconnected', EventType.proxy, result => {
      try {
        callback(result.data);
      } catch (error) {
        console.log(`onProxyDisconnected ${error}`);
      }
    });
  }
  startDeviceDiscovery(callback) {
    this.core.startDeviceDiscovery();
    this.emitter.addListener('deviceStartDiscovery', EventType.core, result => {
      try {
        const devices = JSON.parse(result).map(device => new DeviceInfo(device.ip, device.port, device.name));
        callback(devices);
      } catch (error) {
        console.log(`startDeviceDiscovery ${error}`);
      }
    });
  }
  onLogout(callback) {
    this.emitter.addListener('onLogout', EventType.core, result => {
      try {
        const response = JSON.parse(result);
        this.terminal.reset();
        const logoutReason = new LogoutResponse(response.userToken, response.terminalToken, response.logoutReason);
        callback(logoutReason);
      } catch (error) {
        console.log(`onLogout ${error}`);
      }
    });
  }
  onPause(callback) {
    this.emitter.addListener('onPause', EventType.core, result => {
      try {
        callback(result.data);
      } catch (error) {
        console.log(`onPause ${error}`);
      }
    });
  }
  onResume(callback) {
    this.emitter.addListener('onResume', EventType.core, result => {
      try {
        callback(result.data);
      } catch (error) {
        console.log(`onResume ${error}`);
      }
    });
  }
  onDisconnect(callback) {
    this.emitter.addListener('onDisconnect', EventType.core, result => {
      try {
        callback(result.data);
      } catch (error) {
        console.log(`onDisconnect ${error}`);
      }
    });
  }
  onReconnectSuggestion(callback) {
    this.emitter.addListener('onReconnectSuggestion', EventType.core, result => {
      try {
        callback(result.data);
      } catch (error) {
        console.log(`onReconnectSuggestion ${error}`);
      }
    });
  }
  onStatusChange(callback) {
    this.emitter.addListener('onStatusChange', EventType.core, result => {
      try {
        callback(result);
      } catch (error) {
        console.log(`onStatusChange ${error}`);
      }
    });
  }
  onStartPurchase(callback) {
    this.emitter.addListener('onStartPurchase', EventType.terminal, result => {
      try {
        const purchaseJSON = JSON.parse(JSON.parse(result));
        callback(purchaseJSON);
      } catch (error) {
        console.log(`onStartPurchase ${error}`);
      }
    });
  }
  onStartRefund(callback) {
    this.emitter.addListener('onStartRefund', EventType.terminal, result => {
      try {
        const refundJSON = JSON.parse(JSON.parse(result));
        callback(refundJSON);
      } catch (error) {
        console.log(`onStartRefund ${error}`);
      }
    });
  }
  onStartReverse(callback) {
    this.emitter.addListener('onStartReverse', EventType.terminal, result => {
      try {
        const revereseJSON = JSON.parse(result);
        callback(revereseJSON);
      } catch (error) {
        console.log(`onStartReverse ${error}`);
      }
    });
  }
  onStartReconciliation(callback) {
    this.emitter.addListener('onStartReconciliation', EventType.terminal, result => {
      try {
        const reconciliationJSON = JSON.parse(JSON.parse(result));
        callback(reconciliationJSON);
      } catch (error) {
        console.log(`onStartReconciliation ${error}`);
      }
    });
  }
  onCancelPurchase(callback) {
    this.emitter.addListener('onCancelPurchase', EventType.terminal, result => {
      try {
        const cancelPurchaseJSON = JSON.parse(result);
        callback(cancelPurchaseJSON);
      } catch (error) {
        console.log(`onCancelPurchase ${error}`);
      }
    });
  }
  onCancelRefund(callback) {
    this.emitter.addListener('onCancelRefund', EventType.terminal, result => {
      try {
        const cancelRefundJSON = JSON.parse(result);
        callback(cancelRefundJSON);
      } catch (error) {
        console.log(`onCancelRefund ${error}`);
      }
    });
  }
  onCancelReverse(callback) {
    this.emitter.addListener('onCancelReverse', EventType.terminal, result => {
      try {
        const cancelReverseJSON = JSON.parse(result);
        callback(cancelReverseJSON);
      } catch (error) {
        console.log(`onCancelReverse ${error}`);
      }
    });
  }
  onCancelReconciliation(callback) {
    this.emitter.addListener('onCancelReconciliation', EventType.terminal, result => {
      try {
        const cancelReconciliationJSON = JSON.parse(result);
        callback(cancelReconciliationJSON);
      } catch (error) {
        console.log(`onCancelReconciliation ${error}`);
      }
    });
  }
  onJobStatusChange(callback) {
    this.emitter.addListener('onJobStatusChange', EventType.terminal, result => {
      callback(result);
    });
  }
  onEvent(callback) {
    this.emitter.addListener('onEvent', EventType.terminal, result => {
      callback(result);
    });
  }
  onError(callback) {
    this.emitter.addListener('onError', EventType.terminal, result => {
      try {
        let errorJSON = JSON.parse(result);
        callback(errorJSON);
      } catch (error) {
        console.log(`onError ${error}`);
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
//# sourceMappingURL= NearpayConnectService.js.map