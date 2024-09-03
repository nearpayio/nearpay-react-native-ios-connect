import type LogoutReason from './entities/LogoutReason';
import type DeviceInfo from './entities/NearPayDevice';
import type { TransactionModel } from './Models/TransactionModel';
export type DiscoverDevicesCallback = (devices: DeviceInfo[]) => void;
export type LogoutReasonCallback = (result: LogoutReason) => void;
export type Callback = (result: any) => void;
export type NPRequest = {
    [key: string]: any;
};
export type TransactionCallback = (result: TransactionModel) => void;
//# sourceMappingURL=types.d.ts.map