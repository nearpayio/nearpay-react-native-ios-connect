import { Environment } from './entities/Environment';
import { Job } from './entities/Job';
import { LoginMethod } from './entities/LoginMethod';
import { LogoutResponse } from './entities/LogoutResponse';
import { DeviceInfo } from './entities/NearPayDevice';
import { NetworkConfiguration } from './entities/NetworkConfiguration';
import type { ReconcileModel } from './Models/ReconcileModel';
import type { ReconciliationListModel } from './Models/ReconciliationListModel';
import type { ReceiptModel } from './Models/ReconciliationModel';
import type { Terminal } from './Models/Terminal';
import type { TransactionListModel } from './Models/TransactionListModel';
import type {
  TransactionModel,
  TransactionReceiptModel,
} from './Models/TransactionModel';

import type VerifyResult from './Models/VerifyResult';

export type DiscoverDevicesCallback = (devices: DeviceInfo[]) => void;
export type LogoutReasonCallback = (result: LogoutResponse) => void;
export type Callback = (result: any) => void;
export type NPRequest = { [key: string]: any };
export type TransactionCallback = (result: TransactionModel) => void;

export {
  DeviceInfo,
  LoginMethod,
  LogoutResponse,
  Job,
  Environment,
  NetworkConfiguration,
};
export type {
  VerifyResult,
  Terminal,
  TransactionModel,
  TransactionReceiptModel,
  ReconcileModel,
  ReconciliationListModel,
  ReceiptModel,
  TransactionListModel,
};
