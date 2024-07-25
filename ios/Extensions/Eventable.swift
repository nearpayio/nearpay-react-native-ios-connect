import React

extension RCTEventEmitter {
     func sendEvent(ـ  name: String!, body: Encodable) {
        let jsonEncoder = JSONEncoder()
        guard let jsonData = try? jsonEncoder.encode(body) else { return }
        let jsonString = String(data: jsonData, encoding: .utf8)
        self.sendEvent(withName: name, body: jsonString)
    }
}
