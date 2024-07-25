"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
class LogoutResponse {
  constructor(userToken, terminalToken, logoutReason) {
    this.userToken = userToken;
    this.terminalToken = terminalToken;
    this.logoutReason = logoutReason;
  }
}
exports.default = LogoutResponse;
//# sourceMappingURL=LogoutReason.js.map