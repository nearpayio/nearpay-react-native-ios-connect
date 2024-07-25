
import Foundation

public struct User: Encodable {
    public let token: String
    public let info: UserInfo
}

public struct UserInfo: Encodable {
    public let name: String
    public let mobile: String?
    public let email: String?
}
