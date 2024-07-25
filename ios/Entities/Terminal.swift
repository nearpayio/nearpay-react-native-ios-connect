import Foundation

public struct Terminal: Encodable {
   public let name: String?
    public let tid: String
    public let uuid: String
    public let busy: Bool?
    public let is_locked: Bool?
    public let has_profile: Bool?
}

