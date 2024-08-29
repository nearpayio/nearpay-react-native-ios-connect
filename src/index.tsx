import type Job from './entities/Job';
import LogoutResponse from './entities/LogoutReason';
import DeviceInfo from './entities/NearPayDevice';

import NearpayEventEmitter, { EventType } from './NearpayEventEmitter';
import type {
  Callback,
  DiscoverDevicesCallback,
  LogoutReasonCallback,
  NPRequest,
} from './types';
import NearpayConnectTerminal, {
  type INearpayConnectTerminal,
} from './NearpayConnectTerminal';
import NearpayConnectAuth, {
  type INearpayConnectAuthentication,
} from './NearpayConnectAuthentication';
import { Platform } from 'react-native';
import type { INearpayConnectProxy } from './NearpayConnectProxy';
import NearpayConnectProxy from './NearpayConnectProxy';
import NearpayConnectCore, {
  type INearpayConnectCore,
} from './ NearpayConnectCore';

export class NearpayConnect {
  private core: INearpayConnectCore;
  private auth: INearpayConnectAuthentication;
  private terminal: INearpayConnectTerminal;
  private proxy: INearpayConnectProxy;
  private emitter: typeof NearpayEventEmitter;

  constructor() {
    this.core = NearpayConnectCore as INearpayConnectCore;
    this.auth = NearpayConnectAuth as INearpayConnectAuthentication;
    this.terminal = NearpayConnectTerminal as INearpayConnectTerminal;
    this.proxy = NearpayConnectProxy as INearpayConnectProxy;
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

  onProxyPaired(callback: Callback) {
    this.emitter.addListener(
      'onProxyPaired',
      EventType.proxy,
      (result: any) => {
        try {
          callback(result.data);
        } catch (error) {
          console.log(`onProxyPaired ${error}`);
        }
      }
    );
  }

  onProxyUnpaired(callback: Callback) {
    this.emitter.addListener(
      'onProxyUnpaired',
      EventType.proxy,
      (result: any) => {
        try {
          callback(result.data);
        } catch (error) {
          console.log(`onProxyUnpaired ${error}`);
        }
      }
    );
  }

  onProxyConnected(callback: Callback) {
    this.emitter.addListener(
      'onProxyConnected',
      EventType.proxy,
      (result: any) => {
        try {
          callback(result.data);
        } catch (error) {
          console.log(`onProxyConnected ${error}`);
        }
      }
    );
  }

  onProxyDisconnected(callback: Callback) {
    this.emitter.addListener(
      'onProxyDisconnected',
      EventType.proxy,
      (result: any) => {
        try {
          callback(result.data as string);
        } catch (error) {
          console.log(`onProxyDisconnected ${error}`);
        }
      }
    );
  }

  startDeviceDiscovery(callback: DiscoverDevicesCallback) {
    this.core.startDeviceDiscovery();
    this.emitter.addListener(
      'deviceStartDiscovery',
      EventType.core,
      (result: any) => {
        try {
          const devices: DeviceInfo[] = JSON.parse(result).map(
            (device: any) => new DeviceInfo(device.ip, device.port, device.name)
          );
          callback(devices);
        } catch (error) {
          console.log(`startDeviceDiscovery ${error}`);
        }
      }
    );
  }

  onLogout(callback: LogoutReasonCallback) {
    this.emitter.addListener('onLogout', EventType.core, (result: any) => {
      try {
        const response = JSON.parse(result);
        this.terminal.reset();
        const logoutReason = new LogoutResponse(
          response.userToken,
          response.terminalToken,
          response.logoutReason
        );
        callback(logoutReason);
      } catch (error) {
        console.log(`onLogout ${error}`);
      }
    });
  }

  onPause(callback: Callback) {
    this.emitter.addListener('onPause', EventType.core, (result: any) => {
      try {
        callback(result.data);
      } catch (error) {
        console.log(`onPause ${error}`);
      }
    });
  }

  onResume(callback: Callback) {
    this.emitter.addListener('onResume', EventType.core, (result: any) => {
      try {
        callback(result.data);
      } catch (error) {
        console.log(`onResume ${error}`);
      }
    });
  }

  onDisconnect(callback: Callback) {
    this.emitter.addListener('onDisconnect', EventType.core, (result: any) => {
      try {
        callback(result.data as string);
      } catch (error) {
        console.log(`onDisconnect ${error}`);
      }
    });
  }

  onReconnectSuggestion(callback: Callback) {
    this.emitter.addListener(
      'onReconnectSuggestion',
      EventType.core,
      (result: any) => {
        try {
          callback(result.data as string);
        } catch (error) {
          console.log(`onReconnectSuggestion ${error}`);
        }
      }
    );
  }

  onStatusChange(callback: Callback) {
    this.emitter.addListener(
      'onStatusChange',
      EventType.core,
      (result: any) => {
        try {
          callback(result);
        } catch (error) {
          console.log(`onStatusChange ${error}`);
        }
      }
    );
  }

  onStartPurchase(callback: Callback) {
    this.emitter.addListener(
      'onStartPurchase',
      EventType.terminal,
      (result: any) => {
        try {
          const purchaseJSON = JSON.parse(JSON.parse(result));
          callback(purchaseJSON);
        } catch (error) {
          console.log(`onStartPurchase ${error}`);
        }
      }
    );
  }

  onStartRefund(callback: Callback) {
    this.emitter.addListener(
      'onStartRefund',
      EventType.terminal,
      (result: any) => {
        try {
          const refundJSON = JSON.parse(JSON.parse(result));
          callback(refundJSON);
        } catch (error) {
          console.log(`onStartRefund ${error}`);
        }
      }
    );
  }

  onStartReverse(callback: Callback) {
    this.emitter.addListener(
      'onStartReverse',
      EventType.terminal,
      (result: any) => {
        try {
          const revereseJSON = JSON.parse(result);
          callback(revereseJSON);
        } catch (error) {
          console.log(`onStartReverse ${error}`);
        }
      }
    );
  }

  onStartReconciliation(callback: Callback) {
    this.emitter.addListener(
      'onStartReconciliation',
      EventType.terminal,
      (result: any) => {
        try {
          const reconciliationJSON = JSON.parse(JSON.parse(result));
          callback(reconciliationJSON);
        } catch (error) {
          console.log(`onStartReconciliation ${error}`);
        }
      }
    );
  }
  onCancelPurchase(callback: Callback) {
    this.emitter.addListener(
      'onCancelPurchase',
      EventType.terminal,
      (result: any) => {
        try {
          const cancelPurchaseJSON = JSON.parse(result);
          callback(cancelPurchaseJSON);
        } catch (error) {
          console.log(`onCancelPurchase ${error}`);
        }
      }
    );
  }

  onCancelRefund(callback: Callback) {
    this.emitter.addListener(
      'onCancelRefund',
      EventType.terminal,
      (result: any) => {
        try {
          const cancelRefundJSON = JSON.parse(result);
          callback(cancelRefundJSON);
        } catch (error) {
          console.log(`onCancelRefund ${error}`);
        }
      }
    );
  }

  onCancelReverse(callback: Callback) {
    this.emitter.addListener(
      'onCancelReverse',
      EventType.terminal,
      (result: any) => {
        try {
          const cancelReverseJSON = JSON.parse(result);
          callback(cancelReverseJSON);
        } catch (error) {
          console.log(`onCancelReverse ${error}`);
        }
      }
    );
  }

  onCancelReconciliation(callback: Callback) {
    this.emitter.addListener(
      'onCancelReconciliation',
      EventType.terminal,
      (result: any) => {
        try {
          const cancelReconciliationJSON = JSON.parse(result);
          callback(cancelReconciliationJSON);
        } catch (error) {
          console.log(`onCancelReconciliation ${error}`);
        }
      }
    );
  }

  onJobStatusChange(callback: Callback) {
    this.emitter.addListener(
      'onJobStatusChange',
      EventType.terminal,
      (result: any) => {
        callback(result);
      }
    );
  }

  onEvent(callback: Callback) {
    this.emitter.addListener('onEvent', EventType.terminal, (result: any) => {
      callback(result);
    });
  }

  onJobError(callback: Callback) {
    this.emitter.addListener(
      'onJobError',
      EventType.terminal,
      (result: any) => {
        try {
          let errorJSON = JSON.parse(result);
          callback(errorJSON);
        } catch (error) {
          console.log(`onJobError ${error}`);
        }
      }
    );
  }

  onTerminalError(callback: Callback) {
    this.emitter.addListener(
      'onTerminalError',
      EventType.terminal,
      (result: any) => {
        try {
          let errorJSON = JSON.parse(result);
          callback(errorJSON);
        } catch (error) {
          console.log(`onTerminalError ${error}`);
        }
      }
    );
  }

  build(
    port: number,
    environment: string,
    networkConfiguration: string,
    loadingUi: boolean,
    deviceName: string
  ): Promise<any> {
    return this.proxy.build(
      port,
      environment,
      networkConfiguration,
      loadingUi,
      deviceName
    );
  }

  showConnection(): Promise<any> {
    return this.proxy.showConnection();
  }

  startConnection(): Promise<any> {
    return this.proxy.startConnection();
  }

  stopConnection(): Promise<any> {
    return this.proxy.stopConnection();
  }

  stopDeviceDiscovery(): Promise<boolean> {
    this.terminal.reset();
    return this.core.stopDeviceDiscovery();
  }

  connect(timeout: number, ip: string, port: string): Promise<boolean> {
    return this.core.connect(timeout, ip, port);
  }

  disconnect(): Promise<boolean> {
    this.terminal.reset();
    return this.core.disconnect();
  }

  ping(timeout: number): Promise<boolean> {
    return this.core.ping(timeout);
  }

  login(method: string, value: string, timeout: number): Promise<any> {
    return this.auth.login(method, value, timeout);
  }

  verify(otp: string, timeout: number): Promise<any> {
    return this.auth.verify(otp, timeout);
  }

  getTerminalList(timeout: number): Promise<any> {
    return this.auth.getTerminalList(timeout);
  }

  logout(timeout: number): Promise<boolean> {
    this.terminal.reset();
    return this.auth.logout(timeout);
  }

  connectTerminal(terminalID: string, timeout: number): Promise<any> {
    return this.auth.connectTerminal(terminalID, timeout);
  }

  disconnectFromCurrentTerminal(timeout: number): Promise<boolean> {
    this.terminal.reset();
    return this.auth.disconnectFromCurrentTerminal(timeout);
  }

  getInfo(timeout: number): Promise<any> {
    return this.auth.getInfo(timeout);
  }
  purchase(purchaseData: NPRequest): Promise<any> {
    return this.terminal.purchase(purchaseData);
  }

  refund(refundData: NPRequest): Promise<any> {
    return this.terminal.refund(refundData);
  }

  reverse(reverseData: NPRequest): Promise<any> {
    return this.terminal.reverse(reverseData);
  }

  reconcile(reconcileData: NPRequest): Promise<any> {
    return this.terminal.reconcile(reconcileData);
  }

  start(job: Job) {
    return this.terminal.start(job.id, job.method);
  }

  cancel(job: Job) {
    return this.terminal.cancel(job.id, job.method);
  }

  getTransaction(transactionRequest: NPRequest): Promise<any> {
    return this.terminal.getTransaction(transactionRequest);
  }

  getReconciliation(reconciliationRequest: NPRequest): Promise<any> {
    console.log(reconciliationRequest);
    return this.terminal.getReconciliation(reconciliationRequest);
  }

  getTransactionList(transactionListRequest: NPRequest): Promise<any> {
    return this.terminal.getTransactionList(transactionListRequest);
  }

  getReconciliationList(reconciliationListRequest: NPRequest): Promise<any> {
    return this.terminal.getReconciliationList(reconciliationListRequest);
  }

  disconnectTerminal(timeout: number): Promise<any> {
    this.terminal.reset();
    return this.terminal.disconnect(timeout);
  }
}
