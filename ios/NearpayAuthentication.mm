#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(NearpayConnectAuthentication, NSObject)
RCT_EXTERN_METHOD(login:(NSString *)method
                  value:(NSString *)value
                  timeout:(NSTimeInterval)timeout
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(logout: (NSTimeInterval)timeout
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(verify:(NSString *)otp
                  timeout:(NSTimeInterval)timeout
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getTerminalList: (NSTimeInterval)timeout
                  resolve: (RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)


RCT_EXTERN_METHOD(connectTerminal:(NSString *)terminalID
                  timeout:(NSTimeInterval)timeout
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(disconnectFromCurrentTerminal: (NSTimeInterval)timeout
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getInfo: (NSTimeInterval)timeout
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
    return NO;
}

@end
