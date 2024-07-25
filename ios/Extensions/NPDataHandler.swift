import Foundation

class NPDataHandler {
    private var dictionary: [NPKeys: Any] = [:]
    
    init(initialData: NSDictionary? = nil) {
        if let data = initialData {
            setDictionary(data)
        }
    }
    
    private func setDictionary(_ data: NSDictionary) {
        var NPDictionary: [NPKeys: Any] = [:]
        
        for (key, value) in data {
            if let keyString = key as? String, let myKey = NPKeys(rawValue: keyString) {
                NPDictionary[myKey] = value
            }
        }
        
        self.dictionary = NPDictionary
    }
    
    func getValue(forKey key: NPKeys) -> Any? {
        return dictionary[key]
    }
    
    func setValue(_ value: Any, forKey key: NPKeys) {
        dictionary[key] = value
    }
    
    func removeValue(forKey key: NPKeys) {
        dictionary.removeValue(forKey: key)
    }
    
    func allValues() -> [NPKeys: Any] {
        return dictionary
    }
    
    func updateWithNSDictionary(_ data: NSDictionary) {
        setDictionary(data)
    }
    
    func getSpecificData() -> (jobID: String?, transactionUUID: String?, amount: Double?, customerReferenceNumber: String?, adminPin: String?, enableEditableRefundAmountUi: Bool?, enableReceiptUi: Bool?, enableReversal: Bool?, dismissible: Bool?, terminalTimeout: Int?, timeout: TimeInterval?, startDate: String?, endDate: String?, page: Int?, pageSize: Int?) {
        let jobID = dictionary[.jobID] as? String
        let transactionUUID = dictionary[.transactionUUID] as? String
        let amount = dictionary[.amount] as? Double
        let customerReferenceNumber = dictionary[.customerReferenceNumber] as? String
        let adminPin = dictionary[.adminPin] as? String
        let enableEditableRefundAmountUi = dictionary[.enableEditableRefundAmountUi] as? Bool
        let enableReceiptUi = dictionary[.enableReceiptUi] as? Bool
        let enableReversal = dictionary[.enableReversal] as? Bool
        let dismissible = dictionary[.dismissible] as? Bool
        let terminalTimeout = dictionary[.terminalTimeout] as? Int
        let timeout = dictionary[.timeout] as? TimeInterval
        let startDate = dictionary[.startDate] as? String
        let endDate = dictionary[.endDate] as? String
        let page = dictionary[.page] as? Int
        let pageSize = dictionary[.pageSize] as? Int
        
        return (jobID, transactionUUID, amount, customerReferenceNumber, adminPin, enableEditableRefundAmountUi, enableReceiptUi, enableReversal, dismissible, terminalTimeout, timeout, startDate, endDate, page, pageSize)
    }
}
