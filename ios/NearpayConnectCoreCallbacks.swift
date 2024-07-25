import NearpayConnectCore
import ProximityReader
import React


extension NearpayConnectCore {
    @objc func onLogout() {
        NearpayConnectManager.shared.connectedDevice?.onLogout = { [self] userToken, terminalToken, reason in
            let response = LogoutResponse(userToken: userToken ?? "", terminalToken: terminalToken ?? "" , logoutReason: reason.rawValue)
            let jsonEncoder = JSONEncoder()
            guard let jsonData = try? jsonEncoder.encode(response) else { return }
            let jsonString = String(data: jsonData, encoding: .utf8)
            self.sendEvent(withName: "deviceStartDiscovery", body: jsonString)
        }
    }
    
    @objc func onPause() {
        NearpayConnectManager.shared.connectedDevice?.onPause = { [self] in
            let onPauseResponse = ["Data": "Terminal is paused."]
            self.sendEvent(withName: "onPause", body: onPauseResponse)
        }
    }
    
    @objc func onResume() {
        NearpayConnectManager.shared.connectedDevice?.onResume = { [self] in
            let onResumeResponse = ["Data": "Terminal is resumed."]
            self.sendEvent(withName: "onResume", body: onResumeResponse)
        }
    }
    
    @objc func onDisconnect() {
        NearpayConnectManager.shared.connectedDevice?.onDisconnect = { [self] _ in
            removeConnectedDevice()
            let onDisconnectResponse = ["Data": "Terminal is disconnect."]
            self.sendEvent(withName: "onDisconnect", body: onDisconnectResponse)
        }
    }
    
    @objc func onReconnectSuggestion() {
        NearpayConnectManager.shared.connectedDevice?.onReconnectSuggestion = {
            let onReconnectSuggestionResponse = ["Data": "Reconnect is suggested."]
            self.sendEvent(withName: "onReconnectSuggestion", body: onReconnectSuggestionResponse)
        }
    }
    
    @objc func onStatusChange() {
        NearpayConnectManager.shared.connectedDevice?.onStatusChange = { [self] status in
            let onStatusChangeResponse = ["Data": "\(status.appStatus?.rawValue ?? "")"]
            self.sendEvent(withName: "onStatusChange", body: onStatusChangeResponse)
        }
    }
}
