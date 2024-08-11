# react-native-nearpay-connect-core

## Overview

`react-native-nearpay-connect-core` is a library that provides connectivity and functionality to interact with Nearpay devices. It facilitates functionalities like device discovery, connection, authentication, transaction handling, and job management.

## Installation

To install `react-native-nearpay-connect-core`, you can use npm :

```bash
npm install "https://github.com/nearpayio/nearpay-react-native-ios-connect.git#main" --save
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
nearpay.login(LoginMethod.JWT, "jwt_token", 60000).then(((result: any) => {
// Handle login result

})).catch((error) => {
// Handle error

});
```

Logging in with Email

```js
nearpay.login(LoginMethod.Email, "email_address", 60000).then(((result: any) => {
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
    // Do something here

    }).catch(error => {
    // Handle error

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
nearpay.cancel(job);
```

Starting a purchase Job

```js
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

```

Starting a refund Job

```js
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
```

Starting a reversal Job

```js
    const reverseData: NPRequest = {
      jobID: jobID,
      transactionUUID: state.transactionUUID,
      enableReceiptUi: true,
      dismissible: false,
      terminalTimeout: 60000,
      timeout: 60000
    }
    nearpay.reverse(reverseData)

```

Starting a reconciliation Job

```js
const reconcileData = {
  jobID: jobID,
  adminPin: '0000',
  enableReceiptUi: true,
  dismissible: true,
  terminalTimeout: 600000,
  timeout: 600000,
};
nearpay.reconcile(reconcileData);
```

### Other functions

Disconnect terminal

```js
  const disconnectTerminal = () => {
    nearpay.disconnectTerminal(60000).then((result: any) => {
     // Do something here

    }).catch(error => {
    // Handle error

    });
  }
```

Get user info

```js
  const getUserInfo = () => {
    nearpay.getInfo(60000).then((result: any) => {
    // Do something here

    }).catch(error => {
    // Handle error

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
    // Do something here

    }).catch(error => {
    // Handle error

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
    // Do something here


    }).catch(error => {
    // Handle error

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
     // Do something here

    }).catch(error => {
    // Handle error

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
      // Do something here


    }).catch(error => {
     // Handle error

    });
  }
```

## Callbacks

### Define event listeners for various Nearpay events. For example:

onLogout event

```js
    nearpay.onLogout((result: LogoutReason) => {
    // Handle logout event
    });
```

onResume event

```js
    nearpay.onResume((result: string) => {
    // Handle on resume event

    });
```

onPause event

```js
    nearpay.onPause((result: string) => {
    // Handle on pause event

    });
```

onJobStatusChange event

```js
    nearpay.onJobStatusChange((result: any) => {
      // Handle change job status event

    });
```

onDisconnect event

```js
    nearpay.onDisconnect((result: string) => {
    // Handle on disconnect event

    });

```

onStatusChange event

```js
    nearpay.onStatusChange((result: string) => {
    // Handle on status change event

    });
```

onReconnectSuggestion event

```js
  const onReconnectSuggestionListner = () => {
    nearpay.onReconnectSuggestion((result: string) => {
    // Handle on reconnect suggestion event

    });
```

onStartPurchase event

```js
    nearpay.onStartPurchase((result: any) => {
    // Handle purchase event

    });
```

onStartRefund event

```js
    nearpay.onStartRefund((result: any) => {
    // Handle refund event

});
```

onStartReverse event

```js
    nearpay.onStartReverse((result: any) => {
     // Handle reversal event

});
```

onStartReconciliation event

```js
    nearpay.onStartReconciliation((result: any) => {
    // Handle reconciliation event

});
```

onCancelPurchase event

```js
    nearpay.onCancelPurchase((result: any) => {
    // Handle cancel purchase event

    });
```

onCancelRefund event

```js
    nearpay.onCancelRefund((result: any) => {
    // Handle cancel refund event

    });
```

onCancelReverse event

```js
    nearpay.onCancelReverse((result: any) => {
    // Handle cancel reversal event

});
```

onCancelReconciliation event

```js

    nearpay.onCancelReconciliation((result: any) => {
    // Handle cancel reconciliation event

});

```

onError events

```js
    nearpay.onTerminalError((result: any) => {
     // Do something here

    });

    nearpay.onJobError((result: any) => {
     // Do something here

    });
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
