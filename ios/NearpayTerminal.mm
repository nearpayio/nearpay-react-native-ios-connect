#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(NearpayConnectTerminal, RCTEventEmitter)


RCT_EXTERN_METHOD(purchase: (NSDictionary *) purchaseData
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(refund: (NSDictionary *) refundData
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(reverse: (NSDictionary *) reverseData
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(reconcile: (NSDictionary *) reconcileData
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(cancel:  (NSString *)jobID
                  method:(NSString *)method)

RCT_EXTERN_METHOD(getTransaction: (NSDictionary *)transactionRequest
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getReconciliation: (NSDictionary *)reconciliationRequest
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getTransactionList: (NSDictionary *)transactionListRequest
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getReconciliationList: (NSDictionary *)reconciliationListRequest
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
            
RCT_EXTERN_METHOD(disconnect: (NSTimeInterval *)timeout
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
                  
RCT_EXTERN_METHOD(reset)

+ (BOOL)requiresMainQueueSetup
{
    return NO;
}

@end

