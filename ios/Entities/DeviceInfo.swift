import Foundation
public struct DeviceInfo: Encodable {
    public let ip: String
    public let port: UInt16
    public var name: String?
}
