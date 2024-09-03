export class DeviceInfo {
  ip: string;
  port: number;
  name?: string;
  constructor(ip: string, port: number, name: string) {
    this.ip = ip;
    this.port = port;
    this.name = name;
  }
}
