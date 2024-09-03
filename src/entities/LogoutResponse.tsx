export class LogoutResponse {
  userToken?: string;
  terminalToken: string;
  logoutReason?: string;
  constructor(userToken: string, terminalToken: string, logoutReason: string) {
    this.userToken = userToken;
    this.terminalToken = terminalToken;
    this.logoutReason = logoutReason;
  }
}
