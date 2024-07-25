
import { NativeModules } from 'react-native';
import type { NPRequest } from './types';

export interface INearpayConnectTerminal {
  purchase(purchaseData: NPRequest): Promise<any>;
  refund(refundData: NPRequest): Promise<any>;
  reverse(reverseData: NPRequest): Promise<any>;
  reconcile(reconcileData: NPRequest): Promise<any>
  start(jobID: string, method: string): Promise<any>;
  cancel(jobID: string, method: string): Promise<any>;
  getTransaction(transactionRequest: NPRequest): Promise<any>;
  getReconciliation(reconciliationRequest: NPRequest): Promise<any>;
  getTransactionList(transactionListRequest: NPRequest): Promise<any>;
  getReconciliationList(reconciliationListRequest: NPRequest): Promise<any>;
  disconnect(timeout: number): Promise<any>;
  reset(): Promise<void>;
}

const NearpayConnectTerminal = NativeModules.NearpayConnectTerminal as INearpayConnectTerminal;
export default NearpayConnectTerminal ? NearpayConnectTerminal : new Proxy(
  {},
  {
    get() {
      throw new Error('The package \'nearpay-connect-core\' doesn\'t seem to be linked...');
    },
  }
);

