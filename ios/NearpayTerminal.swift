
import Foundation
import NearpayConnectCore
import React

@objc(NearpayConnectTerminal)
class NearpayConnectTerminal: RCTEventEmitter {
    
    private var purchaseJobs: [JobID:PurchaseJob] = [:]
    private var refundJobs: [JobID:RefundJob] = [:]
    private var reversalJobs: [JobID:ReversalJob] = [:]
    private var reconciliationJobs: [JobID:ReconciliationJob] = [:]
    
    override init() {
        super.init()
    }
    
    @objc override func supportedEvents() -> [String]! {
        return [ "onStartPurchase", "onStartRefund", "onStartReverse", "onStartReconciliation", "onCancelPurchase", "onCancelRefund", "onCancelReverse", "onCancelReconciliation", "onJobError", "onTerminalError",  "onJobStatusChange", "onEvent"]
    }
    
    @objc func purchase(_ purchaseRequest: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        let handler = NPDataHandler(initialData: purchaseRequest)
        let data = handler.getSpecificData()
        guard let jobID = data.jobID, let amount = data.amount,let timeout = data.timeout else {
            sendEvent(ـ: "onTerminalError", body: "Invalid purchase request")
            return
        }
        let purchaseJob = NearpayConnectManager.shared.terminal?.purchase(jobID: jobID, customerReferenceNumber: data.customerReferenceNumber ?? "", amount: Double(amount), enableReceiptUi: data.enableReceiptUi ?? true, enableReversal: data.enableReversal ?? true, dismissible: data.dismissible ?? false, terminalTimeout: data.terminalTimeout ?? 6, timeout: timeout)
        purchaseJobs[jobID] = purchaseJob
        guard let purchaseJob = purchaseJobs[jobID] else { return }
        startJob(purchaseJob)
    }
    
    @objc func refund(_ refundRequest: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        let handler = NPDataHandler(initialData: refundRequest)
        let data = handler.getSpecificData()
        guard let jobID = data.jobID, let transactionUUID = data.transactionUUID, let amount = data.amount,let timeout = data.timeout,let adminPin = data.adminPin else {
            sendEvent(ـ: "onTerminalError", body: "Invalid refund request")
            return
        }
        let refundJob = NearpayConnectManager.shared.terminal?.refund(jobID: jobID, originalJobID: transactionUUID, amount: Double(amount), customerReferenceNumber: data.customerReferenceNumber ?? "" , adminPin: adminPin, enableEditableRefundAmountUi: data.enableEditableRefundAmountUi ?? true, enableReceiptUi: data.enableReceiptUi ?? true, enableReversal: data.enableReversal ?? true, dismissible: data.dismissible ?? false, terminalTimeout: data.terminalTimeout ?? 6,timeout: timeout)
        refundJobs[jobID] = refundJob
        guard let refundJob = refundJobs[jobID] else { return }
        startJob(refundJob)
    }
    
    @objc func reverse(_ reverseRequest: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        let handler = NPDataHandler(initialData: reverseRequest)
        let data = handler.getSpecificData()
        guard let jobID = data.jobID, let transactionUUID = data.transactionUUID, let timeout = data.timeout else {
            sendEvent(ـ: "onTerminalError", body: "Invalid reverse request")
            return
        }
        let reversalJob = NearpayConnectManager.shared.terminal?.reverse(jobID: jobID, originalJobID: transactionUUID, enableReceiptUi: data.enableReceiptUi ?? true, dismissible: data.dismissible ?? false, terminalTimeout: data.terminalTimeout ?? 6, timeout: timeout)
        reversalJobs[jobID] = reversalJob
        guard let reversalJob = reversalJobs[jobID] else { return }
        startJob(reversalJob)
    }
    
    @objc func reconcile(_ reconcileRequest: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        let handler = NPDataHandler(initialData: reconcileRequest)
        let data = handler.getSpecificData()
        guard let jobID = data.jobID, let timeout = data.timeout else {
            sendEvent(ـ: "onTerminalError", body: "Invalid reconcile request")
            return
        }
        
        let reconciliationJob = NearpayConnectManager.shared.terminal?.reconcile(jobID: jobID, adminPin: data.adminPin ?? "", dismissible: data.dismissible ?? false, terminalTimeout: data.terminalTimeout ?? 6, timeout: timeout)
        reconciliationJobs[jobID] = reconciliationJob
        guard let reconciliationJob = reconciliationJobs[jobID] else { return }
        startJob(reconciliationJob)
    }
    
    @objc func cancel(_ jobID: String, method: String) {
        switch method {
            case JobType.purchase.rawValue:
                guard let purchaseJob = purchaseJobs[jobID] else { return }
                cancelJob(purchaseJob)
            case JobType.refund.rawValue:
                guard let refundJob = refundJobs[jobID] else { return }
                cancelJob(refundJob)
            case JobType.reverse.rawValue:
                guard let reversalJob = reversalJobs[jobID] else { return }
                cancelJob(reversalJob)
            case JobType.reconcile.rawValue:
                guard let reconciliationJob = reconciliationJobs[jobID] else { return }
                cancelJob(reconciliationJob)
            default:
                break;
        }
    }
    
    private func startJob(_ job: some AnyJob) {
        let jsonEncoder = JSONEncoder()
        onStatusChangeListner(job.id, method: job.type.rawValue)
        onEventListner(job.id, method: job.type.rawValue)
        job.start { [weak self] result in
            guard let self else { return }
            switch result {
                case .success(let response):
                    switch job.type {
                        case .purchase:
                            let response = response as? PurchaseResponse
                            guard let jsonData = try? jsonEncoder.encode(response) else { return }
                            let jsonString = String(data: jsonData, encoding: .utf8)
                            sendEvent(ـ: "onStartPurchase", body: jsonString)
                        case .refund:
                            let response = response as? RefundResponse
                            guard let jsonData = try? jsonEncoder.encode(response) else { return }
                            let jsonString = String(data: jsonData, encoding: .utf8)
                            sendEvent(ـ: "onStartRefund", body: jsonString)
                        case .reverse:
                            let response = response as? ReversalResponse
                            guard let jsonData = try? jsonEncoder.encode(response) else { return }
                            let jsonString = String(data: jsonData, encoding: .utf8)
                            sendEvent(ـ: "onStartReverse", body: jsonString)
                        case .reconcile:
                            let response = response as? ReconciliationResponse
                            guard let jsonData = try? jsonEncoder.encode(response) else { return }
                            let jsonString = String(data: jsonData, encoding: .utf8)
                            sendEvent(ـ: "onStartReconciliation", body: jsonString)
                    }
                    remove(job)
                case .failure(let error):
                    sendEvent(ـ: "onJobError", body: error.localizedDescription)
            }
        }
    }
    
    private func cancelJob(_ job: some AnyJob) {
        let jsonEncoder = JSONEncoder()
        job.cancel { [weak self] result in
            guard let self else { return }
            switch result {
                case .success(let response):
                    switch job.type {
                        case .purchase:
                            guard let jsonData = try? jsonEncoder.encode(response) else { return }
                            let jsonString = String(data: jsonData, encoding: .utf8)
                            sendEvent(ـ: "onCancelPurchase", body: jsonString)
                            purchaseJobs.removeValue(forKey: job.id)
                        case .refund:
                            guard let jsonData = try? jsonEncoder.encode(response) else { return }
                            let jsonString = String(data: jsonData, encoding: .utf8)
                            sendEvent(ـ: "onCancelRefund", body: jsonString)
                            refundJobs.removeValue(forKey: job.id)
                        case .reverse:
                            guard let jsonData = try? jsonEncoder.encode(response) else { return }
                            let jsonString = String(data: jsonData, encoding: .utf8)
                            sendEvent(ـ: "onCancelReverse", body: jsonString)
                            reversalJobs.removeValue(forKey: job.id)
                        case .reconcile:
                            guard let jsonData = try? jsonEncoder.encode(response) else { return }
                            let jsonString = String(data: jsonData, encoding: .utf8)
                            sendEvent(ـ: "onCancelReconciliation", body: jsonString)
                            reconciliationJobs.removeValue(forKey: job.id)
                    }
                case .failure(let error):
                    sendEvent(ـ: "onJobError", body: error.localizedDescription)
            }
            remove(job)
        }
    }
    
    @objc func getTransaction(_ transactionRequest: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        let handler = NPDataHandler(initialData: transactionRequest)
        let data = handler.getSpecificData()
        guard let jobID = data.jobID, let enableReceiptUi = data.enableReceiptUi, let terminalTimeout = data.terminalTimeout, let timeout = data.timeout else {
            sendEvent(ـ: "onTerminalError", body: "Invalid get transaction request")
            return
        }
        
        NearpayConnectManager.shared.terminal?.getTransaction(with: jobID, enableReceiptUi: enableReceiptUi, terminalTimeout: terminalTimeout, timeout: timeout) { result in
            switch result {
                case .success(let transaction):
                    let jsonEncoder = JSONEncoder()
                    guard let jsonData = try? jsonEncoder.encode(transaction) else { return }
                    let jsonString = String(data: jsonData, encoding: .utf8)
                    resolve(jsonString)
                case .failure(let error):
                    reject("404", error.localizedDescription, error)
            }
        }
    }

    @objc func getReconciliation(_ reconciliationRequest: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        let handler = NPDataHandler(initialData: reconciliationRequest)
        let data = handler.getSpecificData()
        guard let jobID = data.jobID, let enableReceiptUi = data.enableReceiptUi, let terminalTimeout = data.terminalTimeout, let timeout = data.timeout else {
            sendEvent(ـ: "onTerminalError", body: "Invalid get reconciliation request")
            return
        }
        
        NearpayConnectManager.shared.terminal?.getReconciliation(with: jobID, enableReceiptUi: enableReceiptUi, terminalTimeout: terminalTimeout, timeout: timeout) { result in
            switch result {
                case .success(let reconciliation):
                    let jsonEncoder = JSONEncoder()
                    guard let jsonData = try? jsonEncoder.encode(reconciliation) else { return }
                    let jsonString = String(data: jsonData, encoding: .utf8)
                    resolve(jsonString)
                case .failure(let error):
                    reject("404", error.localizedDescription, error)
            }
        }
    }
    
    @objc func getTransactionList(_ transactionListRequest: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        let handler = NPDataHandler(initialData: transactionListRequest)
        let data = handler.getSpecificData()
        guard let startDate = data.startDate, let endDate = data.endDate, let page = data.page, let pageSize = data.pageSize, let timeout = data.timeout else {
            sendEvent(ـ: "onTerminalError", body: "Invalid transaction list request")
            return
        }
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
        formatter.timeZone = TimeZone.current
        guard let firstDate = formatter.date(from: startDate), let secondDate = formatter.date(from: endDate) else {
            sendEvent(ـ: "onTerminalError", body:  "Transaction list invalid date format.")
            return
        }
        NearpayConnectManager.shared.terminal?.getTransactionList(startDate: firstDate, endDate: secondDate, page: page, pageSize: pageSize, timeout: timeout) { [weak self] result in
            guard let self = self else { return }
            switch result {
                case .success(let transactionList):
                    let jsonEncoder = JSONEncoder()
                    guard let jsonData = try? jsonEncoder.encode(transactionList) else { 
                        sendEvent(ـ: "onTerminalError", body:  "Can't encode transaction list data.")
                        return
                     }
                    let jsonString = String(data: jsonData, encoding: .utf8)
                    resolve(jsonString)
                case .failure(let error):
                    reject("404", error.localizedDescription, error)
            }
        }
    }

    @objc func getReconciliationList(_ reconciliationListRequest: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        let handler = NPDataHandler(initialData: reconciliationListRequest)
        let data = handler.getSpecificData()
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
        formatter.timeZone = TimeZone.current
        guard let startDate = data.startDate, let endDate = data.endDate, let page = data.page, let pageSize = data.pageSize, let timeout = data.timeout else {
            sendEvent(ـ: "onTerminalError", body: "Invalid reconciliation list request")
            return
        }
        guard let firstDate = formatter.date(from: startDate), let secondDate = formatter.date(from: endDate) else {
            sendEvent(ـ: "onTerminalError", body:  "Reconciliation list invalid date format.")
            return
        }
        NearpayConnectManager.shared.terminal?.getReconciliationList(startDate: firstDate, endDate: secondDate, page: page, pageSize: pageSize, timeout: timeout) { result in
            switch result {
                case .success(let reconciliationList):
                    let jsonEncoder = JSONEncoder()
                    guard let jsonData = try? jsonEncoder.encode(reconciliationList) else { return }
                    let jsonString = String(data: jsonData, encoding: .utf8)
                    resolve(jsonString)
                case .failure(let error):
                    reject("400", error.localizedDescription, error)
            }
        }
    }
    
    @objc func disconnect(_  timeout: TimeInterval, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        NearpayConnectManager.shared.terminal?.disconnect(timeout: timeout) { result in
            switch result {
                case .success(let isDisconnected):
                    resolve(isDisconnected)
                case .failure(let error):
                    reject("400", error.localizedDescription, error)
            }
        }
    }
    
    private func onStatusChangeListner(_ jobID: String, method: String) {
        guard let method = JobType(rawValue: method) else { return }
        switch method {
            case .purchase:
                guard let purchaseJob = purchaseJobs[jobID] else { return }
                purchaseJob.onStatusChange = { status in
                    let onStatusChangeResponse = ["\(purchaseJob.id)": "\(status)"]
                    self.sendEvent(withName: "onJobStatusChange", body: onStatusChangeResponse)
                }
            case .refund:
                guard let refundJob = refundJobs[jobID] else { return }
                refundJob.onStatusChange = { status in
                    let onStatusChangeResponse = ["\(refundJob.id)": "\(status)"]
                    self.sendEvent(withName: "onJobStatusChange", body: onStatusChangeResponse)
                }
            case .reverse:
                guard let reversalJob = reversalJobs[jobID] else { return }
                reversalJob.onStatusChange = { status in
                    let onStatusChangeResponse = ["\(reversalJob.id)": "\(status)"]
                    self.sendEvent(withName: "onJobStatusChange", body: onStatusChangeResponse)
                }
            case .reconcile:
                guard let reconciliationJob = reconciliationJobs[jobID] else { return }
                reconciliationJob.onStatusChange = { status in
                    let onStatusChangeResponse = ["\(reconciliationJob.id)": "\(status)"]
                    self.sendEvent(withName: "onJobStatusChange", body: onStatusChangeResponse)
                }
        }
    }

    private func onEventListner(_ jobID: String, method: String) {
        guard let method = JobType(rawValue: method) else { return }
        
        switch method {
            case .purchase:
                guard let purchaseJob = purchaseJobs[jobID] else { return }
                purchaseJob.onEvent = { [weak self] eventResponse in
                    guard let self else { return }
                    switch eventResponse {
                        case .success(let event):
                            let onEvent = ["\(purchaseJob.id)": "\(event)"]
                            self.sendEvent(withName: "onEvent", body: onEvent)
                        case .failure(let error):
                            sendEvent(ـ: "onJobError", body: error.localizedDescription)

                    }
                }
            case .refund:
                guard let refundJob = refundJobs[jobID] else { return }
                refundJob.onEvent = { [weak self] eventResponse in
                    guard let self else { return }
                    switch eventResponse {
                        case .success(let event):
                            let onEvent = ["\(refundJob.id)": "\(event)"]
                            self.sendEvent(withName: "onEvent", body: onEvent)
                        case .failure(let error):
                            sendEvent(ـ: "onJobError", body: error.localizedDescription)
                    }
                }         
            case .reverse:
                guard let reversalJob = reversalJobs[jobID] else { return }
                reversalJob.onEvent = { [weak self] eventResponse in
                    guard let self else { return }
                    switch eventResponse {
                        case .success(let event):
                            let onEvent = ["\(reversalJob.id)": "\(event)"]
                            self.sendEvent(withName: "onEvent", body: onEvent)
                        case .failure(let error):
                            sendEvent(ـ: "onJobError", body: error.localizedDescription)
                    }
                }
            case .reconcile:
                guard let reconciliationJob = reconciliationJobs[jobID] else { return }
                reconciliationJob.onEvent = { [weak self] eventResponse in
                    guard let self else { return }
                    switch eventResponse {
                        case .success(let event):
                            let onEvent = ["\(reconciliationJob.id)": "\(event)"]
                            self.sendEvent(withName: "onEvent", body: onEvent)
                        case .failure(let error):
                            sendEvent(ـ: "onJobError", body: error.localizedDescription)
                    }
                }
        }
    }
    
    private func remove(_ job: some AnyJob) {
        switch job.type {
            case .purchase:
                guard let index = purchaseJobs.firstIndex(where: {$0.value.id == job.id}) else {
                    return
                }
                purchaseJobs.remove(at: index)
            case .refund:
                guard let index = refundJobs.firstIndex(where: {$0.value.id == job.id}) else {
                    return
                }
                refundJobs.remove(at: index)
            case .reverse:
                guard let index = reversalJobs.firstIndex(where: {$0.value.id == job.id}) else {
                    return
                }
                reversalJobs.remove(at: index)
            case .reconcile:
                guard let index = reconciliationJobs.firstIndex(where: {$0.value.id == job.id}) else {
                    return
                }
                reconciliationJobs.remove(at: index)
        }
    }
    
    private func removeJobReferences() {
         purchaseJobs.forEach { $0.value.onStatusChange = nil; $0.value.onEvent = nil }
         refundJobs.forEach { $0.value.onStatusChange = nil; $0.value.onEvent = nil }
         reversalJobs.forEach { $0.value.onStatusChange = nil; $0.value.onEvent = nil }
         reconciliationJobs.forEach { $0.value.onStatusChange = nil; $0.value.onEvent = nil }
    }
    
    private func removeJobs() {
        purchaseJobs.removeAll()
        refundJobs.removeAll()
        reversalJobs.removeAll()
        reconciliationJobs.removeAll()
    }
    
    @objc func reset() {
        removeJobReferences()
        removeJobs()
        NearpayConnectManager.shared.clearTerminal()
    }
}


