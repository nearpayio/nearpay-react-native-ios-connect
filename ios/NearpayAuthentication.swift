
import Foundation
import NearpayConnectCore
import React

@objc(NearpayConnectAuthentication)
class NearpayConnectAuthentication: NSObject {
    let connectedDevice = NearpayConnectManager.shared.connectedDevice
    private var auth: NearPayAuthentication?
    private var user: NearPayUser?

    @objc func login(_ method: String, value: String, timeout: Double, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        var loginMethod: LoginMethod!
        switch method {
            case "email":
                loginMethod = .email(value)
            case "mobile":
                loginMethod = .mobile(value)
            case "jwt":
                loginMethod = .jwt(value)
            default:
                break;
        }
        NearpayConnectManager.shared.connectedDevice?.login(with: loginMethod, timeout: timeout) { [weak self] result in
            guard let self else { return }
            switch result {
                case .success(let authenticationObjects):
                    auth = authenticationObjects.authentication
                    guard let terminal = authenticationObjects.terminal else {
                        resolve(authenticationObjects)
                        return
                    }
                    NearpayConnectManager.shared.set(terminal: terminal)
                case .failure(let generalAuthenticationError):
                    reject("404",generalAuthenticationError.localizedDescription , generalAuthenticationError)
            }
        }
    }
    
    @objc func verify(_ otp: String, timeout: TimeInterval, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        auth?.verify(with: otp, timeout: timeout) { [weak self] result in
            guard let self else { return }
            switch result {
                case .success(let user):
                    self.user = user
                    let response = User(token: user.token, info: UserInfo(name: user.info?.name ?? "", mobile: user.info?.mobile, email: user.info?.email))
                    let jsonEncoder = JSONEncoder()
                    guard let jsonData = try? jsonEncoder.encode(response) else { return }
                    let jsonString = String(data: jsonData, encoding: .utf8)
                    resolve(jsonString)
                case .failure(let error):
                    reject("404", error.localizedDescription, error)
            }
        }
    }
    
    @objc func logout(_ timeout: TimeInterval, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        NearpayConnectManager.shared.connectedDevice?.logout(timeout: timeout) { result in
            switch result {
                case .success(let isLoggedOut):
                    self.user = nil
                    NearpayConnectManager.shared.clearTerminal()
                    resolve(isLoggedOut)
                case .failure(let generalAuthenticationError):
                    reject("404",generalAuthenticationError.localizedDescription , generalAuthenticationError)
            }
        }
    }
    
    @objc func getTerminalList(_ timeout: TimeInterval, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        user?.getTerminalList(timeout: timeout) { result in
            switch result {
                case .success(let merchants):
                    let merchant = merchants.first
                    let terminalList = merchant?.terminals
                    let jsonEncoder = JSONEncoder()
                    guard let jsonData = try? jsonEncoder.encode(terminalList) else { return }
                    let jsonString = String(data: jsonData, encoding: .utf8)
                    resolve(jsonString)
                case .failure(let error):
                    reject("404",error.localizedDescription, error)
            }
            
        }
    }
    
    @objc func connectTerminal(_ terminalID: String, timeout: TimeInterval, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        NearpayConnectManager.shared.connectedDevice?.connectToTerminal(with: terminalID, userToken: user?.token ?? "", timeout: timeout) {  result in
            switch result {
                case .success(let terminal):
                    NearpayConnectManager.shared.set(terminal: terminal)
                    resolve(terminal.token)
                case .failure(let error):
                    reject("404",error.localizedDescription, error)
            }
        }
    }
    
    @objc func disconnectFromCurrentTerminal(_ timeout: TimeInterval, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        user?.disconnectFromCurrentTerminal(timeout: timeout) { result in
            switch result {
                case .success(let isDisconnectedFromCurrentTerminal):
                    NearpayConnectManager.shared.clearTerminal()
                    resolve(isDisconnectedFromCurrentTerminal)
                case .failure(let error):
                    reject("404",error.localizedDescription, error)
            }
        }
    }
    
    @objc func getInfo(_ timeout: TimeInterval, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        user?.getInfo(timeout: timeout) { result in
            switch result {
                case .success(let userInfo):
                    let jsonEncoder = JSONEncoder()
                    guard let jsonData = try? jsonEncoder.encode(userInfo) else { return }
                    let jsonString = String(data: jsonData, encoding: .utf8)
                    resolve(jsonString)
                case .failure(let error):
                    reject("404",error.localizedDescription, error)
            }
        }
    }
}
