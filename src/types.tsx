import type LogoutReason from "./entities/LogoutReason";
import type DeviceInfo from "./entities/NearPayDevice";

export type DiscoverDevicesCallback = (devices: DeviceInfo[]) => void
export type LogoutReasonCallback = (result: LogoutReason) => void
export type Callback = (result: any) => void
export type NPRequest =  { [key: string]: any };
