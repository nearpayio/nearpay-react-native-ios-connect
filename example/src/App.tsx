import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Switch,
  ScrollView,
  Alert,
  type AppStateStatus,
  Platform,
} from 'react-native';
import type DeviceInfo from '../../lib/typescript/src/entities/NearPayDevice';
import React, { useEffect, useState } from 'react';
import type LogoutReason from '../../src/entities/LogoutReason';
import uuid from 'react-native-uuid';
import Job from '../../src/entities/Job';
import { NearpayConnect } from '../../src/ NearpayConnectService';
import { PulseAnimation } from './PulseAnimation';
import type { NPRequest } from '../../src/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState as RNAppState } from 'react-native';
import { LoginMethod } from '../../src/entities/LoginMethod';
import { Environment } from '../../src/entities/Environment';
import { NetworkConfiguration } from '../../src/entities/NetworkConfiguration';

interface AppState {
  isConnected: boolean;
  isDiscovering: boolean;
  isHeartbeat: boolean;
  isLoggedIn: boolean;
  isLoginByEmail: boolean;
  deviceList: DeviceInfo[];
  connectedDevice: DeviceInfo | null;
  terminalList: any[];
  jobList: Job[];
  response: string;
  transactionUUID: string;
  purchaseJOBID: string;
  reconcileID: string;
}

export default function App() {
  const nearpay = new NearpayConnect();

  const [state, setState] = useState<AppState>({
    isConnected: false,
    isDiscovering: false,
    isHeartbeat: false,
    isLoggedIn: false,
    isLoginByEmail: false,
    deviceList: [],
    connectedDevice: null,
    terminalList: [],
    jobList: [],
    response: '',
    transactionUUID: '',
    purchaseJOBID: '',
    reconcileID: '',
  });

  useEffect(() => {
    const loadState = async () => {
      try {
        const savedState = await AsyncStorage.getItem('appState');
        if (savedState !== null) {
          setState(JSON.parse(savedState));
        }
      } catch (error) {
        console.error('Error loading state from AsyncStorage:', error);
      }
    };

    loadState();
  }, []);

  useEffect(() => {
    const saveStateToStorage = async () => {
      try {
        await AsyncStorage.setItem('appState', JSON.stringify(state));
      } catch (error) {
        console.error('Error saving state to AsyncStorage:', error);
      }
    };

    saveStateToStorage();
  }, [state]);

  useEffect(() => {
    setupNearpayCallbacks();
  }, []);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background') {
        handleAppBackground();
      } else if (nextAppState === 'active') {
        handleAppForeground();
      }
    };

    const subscription = RNAppState.addEventListener(
      'change',
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [state]);

  const handleAppBackground = () => {
    console.log(`handleAppBackground`);
    saveStateToStorage();
  };

  const handleAppForeground = () => {
    console.log(`handleAppForeground`);
    loadStateFromStorage().then(() => {
      if (state.connectedDevice) {
        reconnectDevice();
      }
    });
  };

  const saveStateToStorage = async () => {
    try {
      await AsyncStorage.setItem('appState', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving state to AsyncStorage:', error);
    }
  };

  const loadStateFromStorage = async () => {
    try {
      const savedState = await AsyncStorage.getItem('appState');
      if (savedState !== null) {
        setState(JSON.parse(savedState));
      }
    } catch (error) {
      console.error('Error loading state from AsyncStorage:', error);
    }
  };

  const reconnectDevice = () => {
    if (state.connectedDevice) {
      nearpay
        .connect(
          6000,
          `${state.connectedDevice.ip}`,
          `${state.connectedDevice.port}`
        )
        .then((result) => {
          setState((prevState) => ({ ...prevState, isConnected: result }));
        })
        .catch((error) => {
          console.error('Error reconnecting device:', error);
        });
    }
  };

  useEffect(() => {
    setupNearpayCallbacks();
    if (Platform.OS == 'android') {
      nearpay.build(
        8080,
        Environment.sandbox,
        NetworkConfiguration.simPreferred,
        true,
        'Ahmed Khalifa'
      );
    }
  }, []);

  /// Discovery functions
  const startDiscovery = () => {
    nearpay.startDeviceDiscovery((devices: DeviceInfo[]) => {
      const startDiscoveryResponseString = `Start discovery result: ${JSON.stringify(devices)}`;
      setState((prevState) => ({
        ...prevState,
        response: startDiscoveryResponseString,
        deviceList: devices,
      }));
    });
  };

  const stopDiscovery = () => {
    setState((prevState) => ({ ...prevState, deviceList: [] }));
    nearpay
      .stopDeviceDiscovery()
      .then((result: boolean) => {
        const stopDiscoveryResponseString = `Stop discovery result: ${JSON.stringify(result)}`;
        setState((prevState) => ({
          ...prevState,
          response: stopDiscoveryResponseString,
          jobList: [],
        }));
        state.isConnected = false;
      })
      .catch((error) => {
        showAlert(error);
      });
  };

  /// Connection functions
  const connectDevice = () => {
    nearpay
      .connect(
        6000,
        `${state.connectedDevice?.ip}`,
        `${state.connectedDevice?.port}`
      )
      .then((result: boolean) => {
        const connectDeviceResponseString = `Connect device result: ${JSON.stringify(result)}`;
        setState((prevState) => ({
          ...prevState,
          response: connectDeviceResponseString,
          isConnected: result,
        }));
      })
      .catch((error) => {
        showAlert(error);
      });
  };

  const disconnectDevice = () => {
    nearpay
      .disconnect()
      .then((result: boolean) => {
        const disconnectDeviceResponseString = `Disconnect device result: ${JSON.stringify(result)}`;
        setState((prevState) => ({
          ...prevState,
          response: disconnectDeviceResponseString,
          isConnected: result,
          jobList: [],
        }));
      })
      .catch((error) => {
        showAlert(error);
      });
  };

  /// Auth functions
  const loginJWT = () => {
    nearpay
      .login(
        LoginMethod.JWT,
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Im9wcyI6ImF1dGgiLCJjbGllbnRfdXVpZCI6IjRkMGMwZmZjLTA2NzctNDM2Zi1hMDgwLWQxY2U3YTBkYWRlZSIsInRlcm1pbmFsX2lkIjoiMDIwOTUwMjEwMDA5NTAyMSJ9LCJpYXQiOjE3MTYxMjIyMzksImV4cCI6MTcxNjEyNDAzOX0.TDSVIrjM84D4HEWIQgFvAJ-4vAHNp21UgkF11GSF3XiH55hWPtCogNDTitq7HTM2jdbOs88Zng6ITFLJ-f1pqQSsVJIXMSK__PRVprIgW42oBD8nVjFsrMN0OmF2ZXT34OkN3rdi65umWccYC-JnUrDRtbPr1EqkErkZvwuuA6rnIyZ-i6XxJieBKg9MynGAddIbXbcO8camFoaA9jhkSpA5ktpCJEBhbixatwte8wutbObHGnUWrj1UTZNOxrExq6_Oe9MavBGRVdanGWaNZpnzufDt9K1G5C0WxY2W5EYXCjglhRF_d2tFKIHBp74fiHzbKBUfSQWSomG3FMkJUQ',
        60000
      )
      .then((result: any) => {
        const loginResponseString = `loginJWT  JSON Result: ${JSON.stringify(result)}`;
        setState((prevState) => ({
          ...prevState,
          response: loginResponseString,
          isLoggedIn: true,
        }));
      })
      .catch((error) => {
        showAlert(error);
      });
  };

  const loginOTP = () => {
    nearpay
      .login('email', 'a.khalifa@nearpay.io', 60000)
      .then((result: any) => {
        const loginResponseString = `login result JSON Result: ${JSON.stringify(result)}`;
        setState((prevState) => ({
          ...prevState,
          response: loginResponseString,
          isLoginByEmail: true,
        }));
        Alert.prompt(
          'OTP',
          'Enter code',
          (otp) => verifyOTP(otp),
          'plain-text'
        );
      })
      .catch((error) => {
        showAlert(error);
      });
  };

  const logoutDevice = async () => {
    nearpay
      .logout(60000)
      .then((result: boolean) => {
        const logoutResponseString = `logout result ${result}`;
        setState((prevState) => ({
          ...prevState,
          isConnected: false,
          isLoggedIn: false,
          isLoginByEmail: false,
          response: logoutResponseString,
          jobList: [],
        }));
      })
      .catch((error) => {
        showAlert(error);
      });
  };
  6;
  const verifyOTP = (otp: string) => {
    nearpay
      .verify(otp, 6000)
      .then((result: any) => {
        const verifyOTPResponseString = `Verify response JSON Result: ${JSON.stringify(result)}`;
        setState((prevState) => ({
          ...prevState,
          response: verifyOTPResponseString,
        }));
        terminalListRetrival();
      })
      .catch((error) => {
        showAlert(error);
      });
  };
  const terminalListRetrival = () => {
    nearpay
      .getTerminalList(6000)
      .then((result: any) => {
        const terminals = JSON.parse(result);
        const terminalListRespinseString = `terminalListRetrival JSON Result: ${JSON.stringify(result)}`;
        setState((prevState) => ({
          ...prevState,
          response: terminalListRespinseString,
          terminalList: terminals,
        }));
      })
      .catch((error) => {
        showAlert(error);
      });
  };

  const connectToTerminal = (terminalID: string) => {
    nearpay
      .connectTerminal(terminalID, 6000)
      .then((result: any) => {
        setState((prevState) => ({
          ...prevState,
          response: result,
          isLoggedIn: true,
        }));
      })
      .catch((error) => {
        showAlert(error);
      });
  };

  /// Ping functions
  const startPing = () => {
    let timerId = setInterval(() => sendPing(), 1000);
    setTimeout(() => {
      clearInterval(timerId);
      setState((prevState) => ({ ...prevState, isHeartbeat: false }));
    }, 10000);
  };

  const sendPing = () => {
    nearpay
      .ping(6000)
      .then((isPongRecieved: any) => {
        console.log(`isPongRecieved: ${isPongRecieved}`);
      })
      .catch((error) => {
        showAlert(error);
      });
  };

  /// Jobs Functions
  const createJob = (method: string) => {
    const jobID = uuid.v4() as string;
    const job = new Job(jobID, method);
    setState((prevState) => ({
      ...prevState,
      jobList: [job, ...state.jobList],
      purchaseJOBID: jobID,
    }));
  };

  const cancelJob = (job: Job) => {
    nearpay.cancel(job);
    removeItemFromAListOfJobs(job, state.jobList);
  };

  const startPurchaseJob = (jobID: string) => {
    Alert.prompt(
      'Purchase',
      'Enter amount',
      (amount) => {
        const purchaseData: NPRequest = {
          jobID: jobID,
          amount: Number(amount) * 100,
          customerReferenceNumber: '',
          enableReceiptUi: true,
          enableReversal: true,
          dismissible: true,
          terminalTimeout: 60000,
          timeout: 60000,
        };
        nearpay.purchase(purchaseData);
      },
      'plain-text'
    );
  };

  const startRefundJob = (jobID: string) => {
    Alert.prompt(
      'Renfund',
      'Enter amount',
      (amount) => {
        const refundData: NPRequest = {
          jobID: jobID,
          transactionUUID: state.transactionUUID,
          amount: Number(amount) * 100,
          customerReferenceNumber: '',
          adminPin: '0000',
          enableEditableRefundAmountUi: false,
          enableReceiptUi: false,
          enableReversal: false,
          dismissible: true,
          terminalTimeout: 60000,
          timeout: 60000,
        };
        nearpay.refund(refundData);
      },
      'plain-text'
    );
  };

  const startReverseJob = (jobID: string) => {
    console.log(`Reverse TransactionUUID: ${state.transactionUUID}`);
    const reverseData: NPRequest = {
      jobID: jobID,
      transactionUUID: state.transactionUUID,
      enableReceiptUi: true,
      dismissible: true,
      terminalTimeout: 600000,
      timeout: 600000,
    };
    nearpay.reverse(reverseData);
  };

  const startReconciliationJob = (jobID: string) => {
    const reconcileData = {
      jobID: jobID,
      adminPin: '0000',
      enableReceiptUi: true,
      dismissible: true,
      terminalTimeout: 600000,
      timeout: 600000,
    };
    nearpay.reconcile(reconcileData);
  };

  const startJob = (job: Job) => {
    if (job.method == 'purchase') {
      startPurchaseJob(job.id);
    } else if (job.method == 'refund') {
      startRefundJob(job.id);
    } else if (job.method == 'reverse') {
      startReverseJob(job.id);
    } else if (job.method == 'reconcile') {
      startReconciliationJob(job.id);
    }
  };

  /// Terminals Functions
  const getTransaction = (uuid: string) => {
    const transactionRequest = {
      jobID: uuid,
      enableReceiptUi: true,
      terminalTimeout: 60000,
      timeout: 60000,
    };
    nearpay
      .getTransaction(transactionRequest)
      .then((result: any) => {
        const transactionString = `Transaction response : ${JSON.stringify(result)}`;
        setState((prevState) => ({
          ...prevState,
          response: transactionString,
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getReconciliation = (id: string) => {
    console.log(`GetReconciliationID: ${id}`);
    const reconciliationRequest = {
      jobID: id,
      enableReceiptUi: true,
      terminalTimeout: 60000,
      timeout: 60000,
    };
    nearpay
      .getReconciliation(reconciliationRequest)
      .then((result: any) => {
        const reconciliationString = `Reconciliation response: ${JSON.stringify(result)}`;
        setState((prevState) => ({
          ...prevState,
          response: reconciliationString,
        }));
      })
      .catch((error) => {
        showAlert(error);
      });
  };

  const getTransactionList = () => {
    const startDate = new Date(Date.UTC(2023, 12, 1));
    const endDate = new Date(Date.UTC(2024, 5, 13));
    const transactionListRequest = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      page: 0,
      pageSize: 10,
      timeout: 60000,
    };
    console.log(`transactionList ${transactionListRequest}`);

    nearpay
      .getTransactionList(transactionListRequest)
      .then((result: any) => {
        console.log(`transactionList ${result}`);

        const transactionListString = `Transaction list response: ${JSON.stringify(result)}`;
        setState((prevState) => ({
          ...prevState,
          response: transactionListString,
        }));
      })
      .catch((error) => {
        console.log(`error transactionList: ${error}}`);
        showAlert(error);
      });
  };

  const getReconciliationList = () => {
    const startDate = new Date(Date.UTC(2023, 12, 1));
    const endDate = new Date(Date.UTC(2024, 5, 13));
    const reconciliationListRequest = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      page: 0,
      pageSize: 10,
      timeout: 60000,
    };
    nearpay
      .getReconciliationList(reconciliationListRequest)
      .then((result: any) => {
        const reconciliationListString = `Reconciliation List response: ${JSON.stringify(result)}`;
        setState((prevState) => ({
          ...prevState,
          response: reconciliationListString,
        }));
      })
      .catch((error) => {
        showAlert(error);
      });
  };

  const disconnectTerminal = () => {
    setState((prevState) => ({ ...prevState, isLoggedIn: false, jobList: [] }));
    nearpay
      .disconnectTerminal(60000)
      .then((result: any) => {
        const disconnectTerminalString = `Disconnect Terminal response: ${JSON.stringify(result)}`;
        setState((prevState) => ({
          ...prevState,
          response: disconnectTerminalString,
        }));
      })
      .catch((error) => {
        showAlert(error);
      });
  };

  const disconnectUser = () => {
    setState((prevState) => ({ ...prevState, isLoggedIn: false, jobList: [] }));
    nearpay
      .disconnectFromCurrentTerminal(60000)
      .then((isDisconnected: boolean) => {
        const disconnectUserString = `Disconnect User response: isDisconnected: ${isDisconnected}`;
        setState((prevState) => ({
          ...prevState,
          response: disconnectUserString,
        }));
      })
      .catch((error) => {
        showAlert(error);
      });
  };

  const getUserInfo = () => {
    nearpay
      .getInfo(60000)
      .then((result: any) => {
        const getUserInfoString = `Get User response: ${JSON.stringify(result)}`;
        setState((prevState) => ({
          ...prevState,
          response: getUserInfoString,
        }));
      })
      .catch((error) => {
        showAlert(error);
      });
  };

  /// Proxy
  const showConnection = () => {
    nearpay.showConnection();
  };

  const startConnection = () => {
    nearpay.startConnection();
  };

  const stopConnection = () => {
    nearpay.stopConnection();
  };

  const onProxyPairedListner = () => {
    nearpay.onProxyPaired((result: string) => {
      console.log('onProxyPaired');
      const onProxyPairedResponseString = `onProxyPaired result: ${JSON.stringify(result)}`;
      setState((prevState) => ({
        ...prevState,
        response: onProxyPairedResponseString,
      }));
    });
  };
  const onProxyUnpairedListner = () => {
    nearpay.onProxyUnpaired((result: string) => {
      console.log('onProxyUnpairedListner');
      const onProxyUnpairedResponseString = `onProxyUnpaired result: ${JSON.stringify(result)}`;
      setState((prevState) => ({
        ...prevState,
        response: onProxyUnpairedResponseString,
      }));
    });
  };

  const onProxyConnectedListner = () => {
    nearpay.onProxyConnected((result: string) => {
      console.log('onProxyConnected');
      const onProxyConnectedResponseString = `onProxyConnected result: ${JSON.stringify(result)}`;
      setState((prevState) => ({
        ...prevState,
        response: onProxyConnectedResponseString,
      }));
    });
  };
  const onProxyDisconnectedListner = () => {
    nearpay.onProxyDisconnected((result: string) => {
      console.log('onProxyDisconnectedListner');
      const onProxyDisconnectedResponseString = `onProxyDisconnected result: ${JSON.stringify(result)}`;
      setState((prevState) => ({
        ...prevState,
        response: onProxyDisconnectedResponseString,
      }));
    });
  };

  /// Callbacks
  const setupNearpayCallbacks = () => {
    onLogoutListner();
    onResumeListner();
    onPauseListner();
    onDisconnectListner();
    onStatusChangeListner();
    onReconnectSuggestionListner();
    onStartPurchaseListner();
    onStartRefundListner();
    onStartReverseListner();
    onStartReconciliationListner();
    onCancelPurchaseListner();
    onCancelRefundListner();
    onCancelReverseListner();
    onCancelReconciliationListner();
    onJobStatusChange();
    onEvent();
    onErrorListner();
    onProxyPairedListner();
    onProxyUnpairedListner();
    onProxyConnectedListner();
    onProxyDisconnectedListner();
  };

  const onLogoutListner = () => {
    nearpay.onLogout((result: LogoutReason) => {
      const logoutResponseString = `Terminal Token: ${result.terminalToken}, User Token: ${result.userToken}, Logout Reason: ${result.logoutReason}`;
      setState((prevState) => ({
        ...prevState,
        response: logoutResponseString,
        isConnected: false,
        isLoggedIn: false,
        isLoginByEmail: false,
        jobList: [],
      }));
    });
  };

  const onResumeListner = () => {
    nearpay.onResume((result: string) => {
      setState((prevState) => ({ ...prevState, response: result }));
    });
  };

  const onPauseListner = () => {
    nearpay.onPause((result: string) => {
      setState((prevState) => ({ ...prevState, response: result }));
    });
  };

  const onJobStatusChange = () => {
    nearpay.onJobStatusChange((result: Status) => {
      const status = Object.entries(result);
      console.log(`status => ${status}`);
      setState((prevState) => ({
        ...prevState,
        response: state.purchaseJOBID,
      }));
    });
  };

  const onDisconnectListner = () => {
    nearpay.onDisconnect((result: string) => {
      setState((prevState) => ({
        ...prevState,
        response: result,
        isLoggedIn: false,
        isLoginByEmail: false,
        isConnected: false,
      }));
    });
  };

  interface Status {
    [key: string]: string;
  }

  const onStatusChangeListner = () => {
    nearpay.onStatusChange((result: Status) => {
      const status = Object.entries(result);
      console.log(`onStatusChange => ${status}`);
    });
  };

  const onEvent = () => {
    nearpay.onEvent((result: Status) => {
      const events = Object.entries(result);
      console.log(`onEvents => ${events}`);
    });
  };

  const onReconnectSuggestionListner = () => {
    +nearpay.onReconnectSuggestion((result: string) => {
      setState((prevState) => ({ ...prevState, response: result }));
    });
  };

  const onStartPurchaseListner = () => {
    nearpay.onStartPurchase((result: any) => {
      const resultString = JSON.stringify(result);
      const transactionUUID = result.transactionReceipts[0].transaction_uuid;
      setState((prevState) => ({
        ...prevState,
        transactionUUID: transactionUUID,
        response: resultString,
      }));
    });
  };

  const onStartRefundListner = () => {
    nearpay.onStartRefund((result: any) => {
      const refundString = JSON.stringify(result);
      const transactionUUID = result.transactionReceipts[0].transaction_uuid;
      setState((prevState) => ({
        ...prevState,
        transactionUUID: transactionUUID,
        response: refundString,
      }));
    });
  };

  const onStartReverseListner = () => {
    nearpay.onStartReverse((result: any) => {
      const reverseString = JSON.stringify(result);
      setState((prevState) => ({ ...prevState, response: reverseString }));
    });
  };

  const onStartReconciliationListner = () => {
    nearpay.onStartReconciliation((result: any) => {
      const reconcileResponseString = JSON.stringify(result);
      const reconcileID = result.reconcileReceipt.id;
      setState((prevState) => ({
        ...prevState,
        reconcileID: reconcileID,
        response: reconcileResponseString,
      }));
    });
  };

  const onCancelPurchaseListner = () => {
    nearpay.onCancelPurchase((result: any) => {
      const cancelPurchaseString = JSON.stringify(result);
      setState((prevState) => ({
        ...prevState,
        response: cancelPurchaseString,
      }));
    });
  };

  const onCancelRefundListner = () => {
    nearpay.onCancelRefund((result: any) => {
      const cancelRefundString = JSON.stringify(result);
      setState((prevState) => ({ ...prevState, response: cancelRefundString }));
    });
  };

  const onCancelReverseListner = () => {
    nearpay.onCancelReverse((result: any) => {
      const cancelReverseString = JSON.stringify(result);
      setState((prevState) => ({
        ...prevState,
        response: cancelReverseString,
      }));
    });
  };

  const onCancelReconciliationListner = () => {
    nearpay.onCancelReconciliation((result: any) => {
      const cancelReconcileString = JSON.stringify(result);
      setState((prevState) => ({
        ...prevState,
        response: cancelReconcileString,
      }));
    });
  };

  const onErrorListner = () => {
    nearpay.onError((result: any) => {
      const error = JSON.stringify(result);
      showAlert(error);
    });
  };

  const removeItemFromAListOfJobs = (job: Job, jobs: Job[]) => {
    const index = jobs.indexOf(job);
    if (index === -1) {
      return;
    }
    jobs.splice(index, 1);
    setState((prevState) => ({ ...prevState, jobList: jobs }));
  };

  const showAlert = (message: string) => {
    Alert.alert('Error', `${message}`);
  };

  return (
    <ScrollView style={{ backgroundColor: 'white' }}>
      {Platform.OS === 'android' && (
        <View>
          <Text style={styles.label}>NPConnect Proxy</Text>

          <View style={styles.row}>
            <Pressable
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 100,
                marginLeft: 12,
                marginTop: 12,
                elevation: 3,
                backgroundColor: 'black',
                height: 30,
                width: 100,
              }}
              onPress={() => startConnection()}
            >
              <Text style={styles.text}>Start</Text>
            </Pressable>
            <Pressable
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 100,
                marginLeft: 12,
                marginTop: 12,
                elevation: 3,
                backgroundColor: 'black',
                height: 30,
                width: 100,
              }}
              onPress={() => stopConnection()}
            >
              <Text style={styles.text}>Stop</Text>
            </Pressable>
            <Pressable
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 100,
                marginLeft: 12,
                marginTop: 12,
                elevation: 3,
                backgroundColor: 'black',
                height: 30,
                width: 100,
              }}
              onPress={() => showConnection()}
            >
              <Text style={styles.text}>Show</Text>
            </Pressable>
          </View>
          <Text
            style={[
              styles.label,
              { display: state.isDiscovering ? 'flex' : 'none' },
            ]}
          >
            Response
          </Text>
          <Text style={{ display: state.isDiscovering ? 'flex' : 'none' }}>
            {state.response}
          </Text>
        </View>
      )}

      {Platform.OS === 'ios' && (
        <View style={{ paddingTop: 80, paddingLeft: 16, paddingRight: 16 }}>
          <Text style={styles.label}>NPConnect Core</Text>

          <View style={styles.row}>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 40,
                fontWeight: 'bold',
                letterSpacing: 0.25,
                verticalAlign: 'auto',
                color: 'black',
                opacity: state.isDiscovering == true ? 1 : 0,
              }}
            >
              Connect
            </Text>
            <View
              style={{
                alignSelf: 'center',
                height: 15,
                width: 15,
                borderRadius: 15,
                marginBottom: 1,
                marginRight: 4,
                backgroundColor: state.isConnected == false ? 'red' : 'green',
                opacity: state.isDiscovering == true ? 1 : 0,
              }}
            />
            <Text
              style={{
                fontSize: 16,
                lineHeight: 40,
                fontWeight: 'bold',
                letterSpacing: 0.25,
                verticalAlign: 'auto',
                color: 'black',
                opacity: state.isConnected == true ? 1 : 0,
              }}
            >
              Login
            </Text>
            <View
              style={{
                alignSelf: 'center',
                height: 15,
                width: 15,
                borderRadius: 15,
                marginBottom: 1,
                backgroundColor: state.isLoggedIn == false ? 'red' : 'green',
                opacity: state.isConnected == true ? 1 : 0,
              }}
            />
            <Text
              style={{
                fontSize: 16,
                lineHeight: 40,
                fontWeight: 'bold',
                letterSpacing: 0.25,
                verticalAlign: 'auto',
                color: 'black',
              }}
            >
              {' '}
              Discovery
            </Text>
            <Switch
              thumbColor="black"
              ios_backgroundColor="#3e3e3e"
              value={state.isDiscovering}
              onValueChange={(switchValue) => {
                setState((prevState) => ({
                  ...prevState,
                  isDiscovering: switchValue,
                }));
                if (switchValue) {
                  startDiscovery();
                } else {
                  if (state.isLoggedIn || state.isLoginByEmail) {
                    logoutDevice();
                  }
                  if (state.isConnected == true) {
                    disconnectDevice();
                  }
                  stopDiscovery();
                }
              }}
            />
          </View>

          <Text
            style={[
              styles.label,
              { display: state.isDiscovering ? 'flex' : 'none' },
            ]}
          >
            Devices
          </Text>
          <ScrollView
            style={{
              backgroundColor: 'aliceblue',
              display: state.isDiscovering ? 'flex' : 'none',
            }}
          >
            <View style={[{ display: state.isDiscovering ? 'flex' : 'none' }]}>
              {state.deviceList.map((device) => {
                return (
                  <View key={device.ip} style={styles.row2}>
                    <Pressable
                      onPress={() => {
                        if (state.isConnected == true) {
                          disconnectDevice();
                        }
                        setState((prevState) => ({
                          ...prevState,
                          connectedDevice: device,
                        }));
                        connectDevice();
                      }}
                    >
                      <Text style={styles.selectableText}>
                        {' '}
                        • {device.name} - {device.ip} - {device.port}
                      </Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </ScrollView>
          <ScrollView>
            <View>
              <View style={styles.row2}>
                <Pressable
                  style={{
                    display:
                      state.isLoggedIn == false && state.isConnected == true
                        ? 'flex'
                        : 'none',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 100,
                    marginLeft: 12,
                    marginTop: 12,
                    elevation: 3,
                    backgroundColor: 'black',
                    height: 30,
                    width: 100,
                  }}
                  onPress={loginJWT}
                >
                  <Text style={styles.text}>Login JWT</Text>
                </Pressable>
                <Pressable
                  style={{
                    display:
                      state.isLoggedIn == false && state.isConnected == true
                        ? 'flex'
                        : 'none',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 100,
                    marginLeft: 12,
                    marginTop: 12,
                    elevation: 3,
                    backgroundColor: 'black',
                    height: 30,
                    width: 100,
                  }}
                  onPress={loginOTP}
                >
                  <Text style={styles.text}>Login Email</Text>
                </Pressable>
                <Pressable
                  style={{
                    display: state.isLoggedIn == true ? 'flex' : 'none',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 100,
                    marginLeft: 12,
                    marginTop: 12,
                    elevation: 3,
                    backgroundColor: 'black',
                    height: 30,
                    width: 100,
                  }}
                  onPress={logoutDevice}
                >
                  <Text style={styles.text}>Logout</Text>
                </Pressable>
              </View>

              <Text
                style={[
                  styles.label,
                  { display: state.isLoginByEmail ? 'flex' : 'none' },
                ]}
              >
                Terminals
              </Text>

              {state.terminalList.map((terminal) => {
                return (
                  <View
                    key={terminal.tid}
                    style={[
                      styles.row2,
                      { display: state.isLoginByEmail ? 'flex' : 'none' },
                    ]}
                  >
                    <Pressable
                      onPress={() => {
                        connectToTerminal(terminal.tid);
                      }}
                    >
                      <Text style={styles.selectableText}>
                        {' '}
                        • TID {terminal.tid}
                      </Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </ScrollView>
          <View
            style={[
              styles.row2,
              { display: state.isLoggedIn == true ? 'flex' : 'none' },
            ]}
          >
            <Pressable
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 100,
                marginLeft: 12,
                marginTop: 12,
                elevation: 3,
                backgroundColor: 'black',
                height: 30,
                width: 100,
              }}
              onPress={() => createJob('purchase')}
            >
              <Text style={styles.text}>Purchase</Text>
            </Pressable>
            <Pressable
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 100,
                marginLeft: 12,
                marginTop: 12,
                elevation: 3,
                backgroundColor: 'black',
                height: 30,
                width: 100,
              }}
              onPress={() => createJob('refund')}
            >
              <Text style={styles.text}>Refund</Text>
            </Pressable>
            <Pressable
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 100,
                marginLeft: 12,
                marginTop: 12,
                elevation: 3,
                backgroundColor: 'black',
                height: 30,
                width: 100,
              }}
              onPress={() => createJob('reverse')}
            >
              <Text style={styles.text}>Reverse</Text>
            </Pressable>
          </View>
          <View
            style={[
              styles.row2,
              { display: state.isLoggedIn == true ? 'flex' : 'none' },
            ]}
          >
            <Pressable
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 100,
                marginLeft: 12,
                marginTop: 12,
                elevation: 3,
                backgroundColor: 'black',
                height: 30,
                width: 100,
              }}
              onPress={() => createJob('reconcile')}
            >
              <Text style={styles.text}>Reconcile</Text>
            </Pressable>
            <Pressable
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 100,
                marginLeft: 12,
                marginTop: 12,
                elevation: 3,
                backgroundColor: 'black',
                height: 30,
                width: 100,
              }}
              onPress={() => getTransaction(state.transactionUUID)}
            >
              <Text style={styles.text}>Transaction</Text>
            </Pressable>
            <Pressable
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 100,
                marginLeft: 12,
                marginTop: 12,
                elevation: 3,
                backgroundColor: 'black',
                height: 30,
                width: 100,
              }}
              onPress={() => getReconciliation(state.reconcileID)}
            >
              <Text style={styles.text}>Reconciliation</Text>
            </Pressable>
          </View>

          <View
            style={[
              styles.row2,
              { display: state.isLoggedIn == true ? 'flex' : 'none' },
            ]}
          >
            <Pressable
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 100,
                marginLeft: 12,
                marginTop: 12,
                elevation: 3,
                backgroundColor: 'black',
                height: 30,
                width: 100,
              }}
              onPress={getTransactionList}
            >
              <Text style={styles.smallText}>TransactionList</Text>
            </Pressable>
            <Pressable
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 100,
                marginLeft: 12,
                marginTop: 12,
                elevation: 3,
                backgroundColor: 'black',
                height: 30,
                width: 100,
              }}
              onPress={getReconciliationList}
            >
              <Text style={styles.smallText}>ReconciliationList</Text>
            </Pressable>
            <Pressable
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 100,
                marginLeft: 12,
                marginTop: 12,
                elevation: 3,
                backgroundColor: 'black',
                height: 30,
                width: 100,
              }}
              onPress={disconnectTerminal}
            >
              <Text style={styles.text}>Disconnect</Text>
            </Pressable>
          </View>
          <View
            style={[
              styles.row2,
              { display: state.isLoggedIn == true ? 'flex' : 'none' },
            ]}
          >
            <Pressable
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 100,
                marginLeft: 12,
                marginTop: 12,
                elevation: 3,
                backgroundColor: 'black',
                height: 30,
                width: 100,
              }}
              onPress={getUserInfo}
            >
              <Text style={styles.smallText}>GetInfo</Text>
            </Pressable>
            <Pressable
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 100,
                marginLeft: 12,
                marginTop: 12,
                elevation: 3,
                backgroundColor: 'black',
                height: 30,
                width: 100,
              }}
              onPress={disconnectUser}
            >
              <Text style={styles.smallText}>DisconnectUSR</Text>
            </Pressable>
          </View>

          <View style={{ opacity: state.isLoggedIn == true ? 1 : 0 }}>
            <Text
              style={[
                styles.label,
                { display: state.jobList.length > 0 ? 'flex' : 'none' },
              ]}
            >
              Jobs
            </Text>
            <ScrollView
              style={[{ display: state.isLoggedIn ? 'flex' : 'none' }]}
            >
              {state.jobList.map((job) => {
                return (
                  <View
                    key={job.id}
                    style={{
                      flexDirection: 'row',
                      backgroundColor: 'gray',
                      height: 40,
                      borderRadius: 15,
                      marginBottom: 20,
                    }}
                  >
                    <Text
                      style={{
                        flex: 0.6,
                        color: 'white',
                        marginVertical: 'auto',
                        fontSize: 8,
                        fontWeight: '500',
                        marginRight: 6,
                        marginLeft: 6,
                      }}
                    >
                      {' '}
                      {job.id}
                    </Text>
                    <View style={{ flexDirection: 'row', flex: 0.55 }}>
                      <Pressable
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 15,
                          elevation: 3,
                          backgroundColor: 'green',
                          height: 25,
                          width: 50,
                          marginVertical: 'auto',
                          marginStart: 'auto',
                          marginRight: 10,
                          marginBottom: 5,
                        }}
                        onPress={() => startJob(job)}
                      >
                        <Text style={styles.text}>Start</Text>
                      </Pressable>
                      <Pressable
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 15,
                          elevation: 3,
                          backgroundColor: 'black',
                          height: 25,
                          width: 50,
                          marginVertical: 'auto',
                          marginStart: 'auto',
                          marginRight: 10,
                          marginBottom: 5,
                        }}
                        onPress={() => startJob(job)}
                      >
                        <Text style={styles.text}>Retry</Text>
                      </Pressable>
                      <Pressable
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 15,
                          elevation: 3,
                          backgroundColor: 'red',
                          height: 25,
                          width: 50,
                          marginVertical: 'auto',
                          marginStart: 'auto',
                          marginRight: 10,
                          marginBottom: 5,
                        }}
                        onPress={() => cancelJob(job)}
                      >
                        <Text style={styles.text}>Cancel</Text>
                      </Pressable>
                    </View>
                  </View>
                );
              })}
            </ScrollView>

            <Text style={styles.label}>Heartbeat</Text>
            <View style={styles.row2}>
              <PulseAnimation
                color={state.isHeartbeat ? 'green' : 'red'}
                numPulses={3}
                diameter={30}
                speed={20}
                duration={2000}
              />

              <Text
                style={{
                  fontSize: 22,
                  lineHeight: 40,
                  fontWeight: 'bold',
                  letterSpacing: 0.25,
                  color: 'gray',
                }}
              >
                {' '}
                {state.connectedDevice?.name}
              </Text>
              <Switch
                thumbColor="black"
                ios_backgroundColor="#3e3e3e"
                style={{ marginStart: 'auto' }}
                value={state.isHeartbeat}
                onValueChange={(switchValue) => {
                  setState((prevState) => ({
                    ...prevState,
                    isHeartbeat: switchValue,
                  }));
                  if (switchValue) {
                    startPing();
                  } else {
                  }
                }}
              />
            </View>
          </View>

          <Text
            style={[
              styles.label,
              { display: state.isDiscovering ? 'flex' : 'none' },
            ]}
          >
            Response
          </Text>
          <Text style={{ display: state.isDiscovering ? 'flex' : 'none' }}>
            {state.response}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  row2: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 12,
    width: 'auto',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 100,
    elevation: 3,
    backgroundColor: 'black',
    marginBottom: 20,
    height: 45,
    width: 175,
  },
  text: {
    fontSize: 12,
    lineHeight: 21,
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    fontWeight: '500',
    color: 'white',
  },
  smallText: {
    fontSize: 10,
    lineHeight: 21,
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    fontWeight: '500',
    color: 'white',
  },
  selectableText: {
    fontSize: 12,
    lineHeight: 30,
    letterSpacing: 0.25,
    color: 'gray',
    fontWeight: 'bold',
  },
  selected: {
    backgroundColor: 'coral',
    borderWidth: 0,
  },
  selectedLabel: {
    color: 'white',
  },
  label: {
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 50,
    marginBottom: 20,
    fontSize: 26,
    backgroundColor: 'oldlace',
    fontWeight: '900',
  },
});
