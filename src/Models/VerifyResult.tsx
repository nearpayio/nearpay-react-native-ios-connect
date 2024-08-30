export default interface UserInfo {
  mobile: string;
  email: string;
  name: string;
}

export default interface VerifyResult {
  token: string;
  info: UserInfo;
}
