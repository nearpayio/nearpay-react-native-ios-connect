
import NearpayConnectCore
class NearpayConnectManager {
    static let shared = NearpayConnectManager()
    internal var connectedDevice: NearPayDevice?
    internal var terminal: NearPayTerminal?
    
    private init() { }
    
     func set(terminal: NearPayTerminal) {
        self.terminal = terminal
    }
    
     func set(device: NearPayDevice?) {
        self.connectedDevice = device
    }
    
    func clearTerminal() {
        terminal = nil
    }
    
    func clearConnectedDevice() {
        connectedDevice = nil
    }
}
