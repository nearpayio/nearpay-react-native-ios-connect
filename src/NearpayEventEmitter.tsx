import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

class NearpayEventEmitter {
  private coreEmitter?: NativeEventEmitter;
  private terminalEmitter?: NativeEventEmitter;
  private proxyEmitter?: NativeEventEmitter;

  private listeners: { [key: string]: (() => void) | undefined } = {};

  constructor() {
    if (Platform.OS === 'ios') {
      this.coreEmitter = new NativeEventEmitter(
        NativeModules.NearpayConnectCore
      );
      this.terminalEmitter = new NativeEventEmitter(
        NativeModules.NearpayConnectTerminal
      );
    } else if (Platform.OS === 'android') {
      this.proxyEmitter = new NativeEventEmitter(
        NativeModules.NearpayConnectCoreModule
      );
    }
  }

  public addListener<T>(
    eventName: string,
    type: EventType,
    callback: (data: T) => void
  ): void {
    // Remove existing listener if it exists
    this.removeListener(eventName);

    if (Platform.OS === 'ios') {
      if (type === EventType.core) {
        this.coreEmitter?.addListener(eventName, callback);
        this.listeners[eventName] = () =>
          this.coreEmitter?.removeAllListeners(eventName);
      } else if (type === EventType.terminal) {
        this.terminalEmitter?.addListener(eventName, callback);
        this.listeners[eventName] = () =>
          this.terminalEmitter?.removeAllListeners(eventName);
      }
    } else if (Platform.OS === 'android') {
      if (type === EventType.proxy) {
        this.proxyEmitter?.addListener(eventName, callback);
        this.listeners[eventName] = () =>
          this.proxyEmitter?.removeAllListeners(eventName);
      }
    }
  }

  public removeListener(eventName: string): void {
    const listener = this.listeners[eventName];
    if (listener) {
      listener(); // Remove the existing listener
      delete this.listeners[eventName]; // Delete the reference
    }
  }
}

export default new NearpayEventEmitter();

export enum EventType {
  terminal,
  core,
  proxy,
}
