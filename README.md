# react-native-nearpay-connect-core

## Overview

`react-native-nearpay-connect-core` is a library that provides connectivity and functionality to interact with Nearpay devices. It facilitates functionalities like device discovery, connection, authentication, transaction handling, and job management.

## Installation

To install `react-native-nearpay-connect-core`, you can use npm or yarn:

```bash
npm install react-native-nearpay-connect-core
```

or

```bash
yarn add react-native-nearpay-connect-core
```

## Usage

### Importing the library

```js
import { NearpayConnect } from 'react-native-nearpay-connect-core';
```

### Creating an instance

```js
const nearpay = new NearpayConnect();
```

### Discovery Functions

Starting Device Discovery

```js
nearpay.startDeviceDiscovery((devices: DeviceInfo[]) => {
  // Handle discovered devices
});
```

Stopping Device Discovery

```js
nearpay.stopDeviceDiscovery().then((result: boolean) => {
  // Handle stop discovery result
}).catch((error) => {
  // Handle error
});
```

### Connection Functions

Connecting to a Device

```js
nearpay.connect(6000, `${state.connectedDevice?.ip}`, `${state.connectedDevice?.port}`).then((result: boolean) => {
  // Handle connection result
}).catch((error) => {
  // Handle error
});
```

Disconnecting from a Device

```js
nearpay.disconnect().then((result: boolean) => {
  // Handle disconnection result
}).catch((error) => {
  // Handle error
});
```

### Authentication Functions

Logging in with JWT

```js
nearpay.login("jwt", "jwt_token", 60000).then(((result: any) => {
  // Handle login result
})).catch((error) => {
  // Handle error
});
```

Logging in with Email

```js
nearpay.login("email", "email_address", 60000).then(((result: any) => {
  // Handle login result
})).catch((error) => {
  // Handle error
});
```

Logging out

```js
nearpay.logout(60000).then(((result: boolean) => {
  // Handle logout result
})).catch((error) => {
  // Handle error
});
```

disconnect user

```js
  const disconnectUser = () => {
    nearpay.disconnectFromCurrentTerminal(60000).then((isDisconnected: boolean) => {
      concole.log(isDisconnected);
    }).catch(error => {
      showAlert(error);
    });
  }
```

### Transaction and Job Management

Creating a Job

```js
const createJob = (method: string) => {
   const job = new Job(jobID, method);
};
```

Cancelling a Job

```js
const cancelJob = (job: Job) => {
  nearpay.cancel(job);
};
```

Starting a purchase Job

```js
  const startPurchaseJob = (jobID: string) => {
    Alert.prompt('Purchase', 'Enter amount',
      (amount) => {
        const purchaseData: NPRequest = {
          jobID: jobID,
          amount: Number(amount) * 100,
          customerReferenceNumber: "",
          enableReceiptUi: true,
          enableReversal: true,
          dismissible: false,
          terminalTimeout: 60000,
          timeout: 60000
        }
        nearpay.purchase(purchaseData);
      },
      'plain-text');
  }
```

Starting a refund Job

```js
  const startRefundJob = (jobID: string) => {
    Alert.prompt('Renfund', 'Enter amount',
      (amount) => {
        const refundData: NPRequest = {
          jobID: jobID,
          transactionUUID: state.transactionUUID,
          amount: Number(amount) * 100,
          customerReferenceNumber: "",
          adminPin: "0000",
          enableEditableRefundAmountUi: false,
          enableReceiptUi: false,
          enableReversal: false,
          dismissible: false,
          terminalTimeout: 60000,
          timeout: 60000
        }
        nearpay.refund(refundData);
      },
      'plain-text');
  }
```

Starting a reversal Job

```js
  const startReverseJob = (jobID: string) => {
    const reverseData: NPRequest = {
      jobID: jobID,
      transactionUUID: state.transactionUUID,
      enableReceiptUi: true,
      dismissible: false,
      terminalTimeout: 600000,
      timeout: 600000
    }
    nearpay.reverse(reverseData)
  }
```

Starting a reconciliation Job

```js
  const startReconciliationJob = (jobID: string) => {
    const reconcileData = {
      jobID: jobID,
      adminPin: "0000",
      enableReceiptUi: true,
      dismissible: true,
      terminalTimeout: 600000,
      timeout: 600000
    }
    nearpay.reconcile(reconcileData);
  }
```

### Other functions

Disconnect terminal

```js
  const disconnectTerminal = () => {
    nearpay.disconnectTerminal(60000).then((result: any) => {
      const disconnectTerminalString = `${JSON.stringify(result)}`
      console.log(disconnectTerminalString);
    }).catch(error => {
      showAlert(error);
    });
  }
```

Get user info

```js
  const getUserInfo = () => {
    nearpay.getInfo(60000).then((result: any) => {
      const getUserInfoString = `${JSON.stringify(result)}`
      console.log(getUserInfoString);
    }).catch(error => {
      showAlert(error);
    });
  }
```

## Queries functions

Getting a transaction

```js
  const getTransaction = (uuid: string) => {
    const transactionRequest = {
      jobID: uuid,
      enableReceiptUi: true,
      terminalTimeout: 60000,
      timeout: 60000
    }
    nearpay.getTransaction(transactionRequest).then((result: any) => {
    }).catch(error => {
      console.log(error);
    });
  }
```

Getting a reconciliation

```js
  const getReconciliation = (uuid: string) => {
    const reconciliationRequest = {
      jobID: uuid,
      enableReceiptUi: true,
      terminalTimeout: 60000,
      timeout: 60000
    }
    nearpay.getReconciliation(reconciliationRequest).then((result: any) => {
    }).catch(error => {
      showAlert(error);
    });
  }
```

Getting transaction list

```js
const getTransactionList = () => {
    const startDate = new Date(Date.UTC(2023, 12, 1));
    const endDate = new Date(Date.UTC(2024, 5, 13));
    const transactionListRequest = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      page: 0,
      pageSize: 10,
      timeout: 60000
    }
    nearpay.getTransactionList(transactionListRequest).then((result: any) => {
      const transactionListString = `Transaction list response JSON Ressdault: ${JSON.stringify(result)}`
      setState((prevState) => ({ ...prevState, response: transactionListString }));
    }).catch(error => {
      showAlert(error);
    });
  }
```

Getting reconciliation list

```js
  const getReconciliationList = () => {
    const startDate = new Date(Date.UTC(2023, 12, 1));
    const endDate = new Date(Date.UTC(2024, 5, 13));
    const reconciliationListRequest = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      page: 0,
      pageSize: 10,
      timeout: 60000
    }
    nearpay.getReconciliationList(reconciliationListRequest).then((result: any) => {
      const reconciliationListString = `Reconciliation List response JSON Result: ${JSON.stringify(result)}`
      setState((prevState) => ({ ...prevState, response: reconciliationListString }));
    }).catch(error => {
      showAlert(error);
    });
  }
```

## Callbacks

### Define event listeners for various Nearpay events. For example:

onLogout event

```js
 const onLogoutListner = () => {
    nearpay.onLogout((result: LogoutReason) => {
        // Handle logout event
    });
  }
```

onResume event

```js
  const onResumeListner = () => {
    nearpay.onResume((result: string) => {
          // Handle on resume event

    });
  }
```

onPause event

```js
  const onPauseListner = () => {
    nearpay.onPause((result: string) => {
         // Handle on pause event

    });
  }
```

onJobStatusChange event

```js
  const onJobStatusChange = () => {
    nearpay.onJobStatusChange((result: any) => {
      let status = result[`status`];
      console.log(`${status}`);
      // Handle change job status event

    });
  }
```

onDisconnect event

```js
  const onDisconnectListner = () => {
    nearpay.onDisconnect((result: string) => {
    // Handle on disconnect event

    });
  }
```

onStatusChange event

```js
  const onStatusChangeListner = () => {
    nearpay.onStatusChange((result: string) => {
        // Handle on status change event

    });
  }
```

onReconnectSuggestion event

```js
  const onReconnectSuggestionListner = () => {
    nearpay.onReconnectSuggestion((result: string) => {
        // Handle on reconnect suggestion event

    });
  }
```

onStartPurchase event

```js
  const onStartPurchaseListner = () => {
    nearpay.onStartPurchase((result: any) => {
      // Handle purchase event
      const resultString = JSON.stringify(result);
      const transactionUUID = result.transactionReceipts[0].transaction_uuid

    });
  }
```

onStartRefund event

```js
  const onStartRefundListner = () => {
    nearpay.onStartRefund((result: any) => {
       // Handle refund event
      const refundString = JSON.stringify(result)
    });
  }
```

onStartReverse event

```js
  const onStartReverseListner = () => {
    nearpay.onStartReverse((result: any) => {
     // Handle reversal event
      const reverseString = JSON.stringify(result)
    });
  }
```

onStartReconciliation event

```js
  const onStartReconciliationListner = () => {
    nearpay.onStartReconciliation((result: any) => {
     // Handle reconciliation event
      const reconcileResponseString = JSON.stringify(result)
    });
  }
```

onCancelPurchase event

```js
  const onCancelPurchaseListner = () => {
    nearpay.onCancelPurchase((result: any) => {
         // Handle cancel purchase event
      const cancelPurchaseString = JSON.stringify(result)
    });
  }
```

onCancelRefund event

```js
  const onCancelRefundListner = () => {
    nearpay.onCancelRefund((result: any) => {
         // Handle cancel refund event
      const cancelRefundString = JSON.stringify(result)
      setState((prevState) => ({ ...prevState, response: cancelRefundString }));
    });
  }
```

onCancelReverse event

```js
  const onCancelReverseListner = () => {
    nearpay.onCancelReverse((result: any) => {
         // Handle cancel reversal event
      const cancelReverseString = JSON.stringify(result)
    });
  }
```

onCancelReconciliation event

```js
  const onCancelReconciliationListner = () => {
    nearpay.onCancelReconciliation((result: any) => {
         // Handle cancel reconciliation event
      const cancelReconcileString = JSON.stringify(result)
    });
  }
```

onError event

```js
  const onErrorListner = () => {
    nearpay.onError((result: any) => {
      // Handle error event
      const error = JSON.stringify(result);
    })
  }
```

## Proxy Functions (Android)

### Init Proxy

```js
nearpay.build(
  8080,
  Environment.sandbox,
  NetworkConfiguration.simPreferred,
  true,
  'Ahmed Khalifa'
);
```

### Connection Functions

Show Connection

```js
nearpay.showConnection();
```

Start Connection

```js
nearpay.startConnection();
```

Stop Function

```js
nearpay.stopConnection();
```

## Callbacks

### Define event listeners for various Nearpay events. For example:

```js
    nearpay.onProxyPaired((result: string) => {
      // Do something here

    });
```

```js
    nearpay.onProxyUnpaired((result: string) => {
      // Do something here

    });
```

```js
    nearpay.onProxyConnected((result: string) => {
      // Do something here

    });
```

```js
    nearpay.onProxyDisconnected((result: string) => {
      // Do something here

    });
```
