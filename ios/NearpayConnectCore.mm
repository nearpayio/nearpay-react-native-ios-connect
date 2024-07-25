#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(NearpayConnectCore, RCTEventEmitter)

RCT_EXTERN_METHOD(startDeviceDiscovery)
RCT_EXTERN_METHOD(stopDeviceDiscovery: (RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(connect: (NSTimeInterval *)timeout
                  ip: (NSString *)ip
                  port:(NSString *)port
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(disconnect: (RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(ping:  (NSTimeInterval *)timeout
                  resolve: (RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(supportedEvents)

RCT_EXTERN_METHOD(onLogout)
RCT_EXTERN_METHOD(onPause)
RCT_EXTERN_METHOD(onResume)
RCT_EXTERN_METHOD(onDisconnect)
RCT_EXTERN_METHOD(onReconnectSuggestion)
RCT_EXTERN_METHOD(onStatusChange)




+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end



