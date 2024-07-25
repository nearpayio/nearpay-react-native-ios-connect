import Foundation
public struct LogoutResponse: Encodable {
    public let userToken: String
    public let terminalToken: String
    public let logoutReason: String
}
