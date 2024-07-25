import NearpayConnectCore
import ProximityReader
import React
@objc(NearpayConnectCore)
class NearpayConnectCore: RCTEventEmitter {
    private var nearpay: NearPay!

    @objc override func supportedEvents() -> [String]! {
        return ["deviceStartDiscovery", "onLogout", "onPause", "onResume", "onDisconnect", "onReconnectSuggestion", "onStatusChange", "onStartPurchase", "onStartRefund", "onStartReverse", "onCancelPurchase", "onCancelRefund", "onCancelReverse"]
    }
    
    override init() {
        super.init()
        DispatchQueue.main.async {
            self.nearpay = NearPay()
        }
    }
    
    @objc func startDeviceDiscovery() {
        DispatchQueue.main.async {
            self.nearpay.startDeviceDiscovery { deviceList in
                let response = deviceList.map { DeviceInfo(ip: $0.info.ip, port: $0.info.port, name: $0.info.name) }
                let jsonEncoder = JSONEncoder()
                guard let jsonData = try? jsonEncoder.encode(response) else { return }
                let jsonString = String(data: jsonData, encoding: .utf8)
                self.sendEvent(withName: "deviceStartDiscovery", body: jsonString)
            }
        }
    }
    
    @objc func stopDeviceDiscovery(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        resolve(false)
        nearpay.stopDeviceDiscovery()
    }
    
    @objc func connect(_ timeout: TimeInterval, ip: String, port: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        let myport: UInt16 = UInt16(port) ?? 8080
        let connectedDevice = nearpay.device(with: ip, port:myport)
        NearpayConnectManager.shared.set(device: connectedDevice)
        connectedDevice.connect(timeout: timeout) { isSuccessful in
            resolve(isSuccessful);
        }
    }
    
    @objc func disconnect(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        NearpayConnectManager.shared.connectedDevice?.disconnect()
        removeConnectedDevice()
        NearpayConnectManager.shared.clearTerminal()
        resolve(false)
    }
    
    @objc func ping(_ timeout: TimeInterval, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        NearpayConnectManager.shared.connectedDevice?.ping(timeout: timeout) { isPongRecieved in
            resolve(isPongRecieved)
        }
    }
    
    internal func removeConnectedDevice() {
        removeDeviceReferences()
        NearpayConnectManager.shared.clearConnectedDevice()
    }
    
    private func removeDeviceReferences() {
        NearpayConnectManager.shared.connectedDevice?.onLogout = nil
        NearpayConnectManager.shared.connectedDevice?.onDisconnect = nil
        NearpayConnectManager.shared.connectedDevice?.onPause = nil
        NearpayConnectManager.shared.connectedDevice?.onReconnectSuggestion = nil
        NearpayConnectManager.shared.connectedDevice?.onResume = nil
        NearpayConnectManager.shared.connectedDevice?.onStatusChange = nil
        NearpayConnectManager.shared.connectedDevice?.onTerminalDisconnect = nil
    }
}
