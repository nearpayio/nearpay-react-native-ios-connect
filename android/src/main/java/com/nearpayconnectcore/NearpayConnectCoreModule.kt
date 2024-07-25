package com.nearpayconnectcore

import android.app.Application
import android.os.Handler
import android.os.Looper
import android.provider.Settings.Global.putString
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule

import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments
import com.facebook.react.modules.core.DeviceEventManagerModule
import io.nearpay.proxy.NearpayProxy
import io.nearpay.proxy.connection.ConnectionStatusListener
import io.nearpay.proxy.data.enums.NetworkConfiguration
import io.nearpay.proxy.utils.Environments
import okhttp3.Dispatcher

class NearpayConnectCoreModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

  private lateinit var nearpayProxy: NearpayProxy

  private val context: ReactApplicationContext = reactContext



  val connectionStatusListener = object : ConnectionStatusListener {
    override fun onPaired() {
      val params = Arguments.createMap().apply {
        putString("onProxyPaired", "connection status listener")
      }
      sendEvent(reactContext, "onProxyPaired", params)
    }

    override fun onUnpaired() {
      val params = Arguments.createMap().apply {
        putString("onProxyUnpaired", "connection status listener")
      }
      sendEvent(reactContext, "onProxyUnpaired", params)
    }

    override fun onConnected() {
      val params = Arguments.createMap().apply {
        putString("onProxyConnected", "connection status listener")
      }
      sendEvent(reactContext, "onProxyConnected", params)
    }

    override fun onDisconnected() {
      val params = Arguments.createMap().apply {
        putString("onProxyDisconnected", "connection status listener")
      }
      sendEvent(reactContext, "onProxyDisconnected", params)
    }


  }
  @ReactMethod
  fun build(
    port: Int,
    environment: String,
    networkConfiguration: String,
    loadingUi: Boolean,
    deviceName: String,
  ) {
    val _environment = when (environment) {
      "staging" -> Environments.STAGING
      "sandbox" -> Environments.SANDBOX
      "saudiPaymentTesting" -> Environments.TESTING
      "production" -> Environments.PRODUCTION
      else -> Environments.SANDBOX
    }

    val _networkConfiguration = when (networkConfiguration) {
      "default" -> NetworkConfiguration.DEFAULT
      "simPreferred" -> NetworkConfiguration.SIM_PREFERRED
      "simOnly" -> NetworkConfiguration.SIM_ONLY
      else -> NetworkConfiguration.DEFAULT
    }
    val applicationContext = context.applicationContext as Application


    val mainHandler = Handler(Looper.getMainLooper())

    mainHandler.post {
      nearpayProxy = NearpayProxy.Builder()
        .port(port)
        .context(applicationContext)
        .environment(_environment)
        .networkConfiguration(_networkConfiguration)
        .loadingUi(loadingUi)
        .deviceName(deviceName)
        .connectionListener(connectionStatusListener)
        .build()
    }

  }
  override fun getName(): String {
    return "NearpayConnectCoreModule";
  }
  @ReactMethod
  fun showConnection() {
    nearpayProxy.showConnection()
  }
  @ReactMethod
  fun startConnection() {
    nearpayProxy.startConnection()
  }
  @ReactMethod
  fun stopConnection() {
    nearpayProxy.stopConnection()
  }


  private fun sendEvent(reactContext: ReactApplicationContext, eventName: String, params: WritableMap?) {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(eventName, params)
  }

  companion object {
    const val NAME = "NearpayConnectCore"
  }
}
