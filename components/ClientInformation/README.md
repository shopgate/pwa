# ClientInformation
---

This component provides the user with information about the app and lib versions as well as the user's devide ID. The device ID is only shown if the user touches and holds on the component for 5 seconds. Additionaly a message is posted in #app_debug_logging and debug logging is enabled.

## Getting Started

```
import ClientInformation from 'Templates/navigation-drawer/client-information';

<ClientInformation />
```

## Props

### client (required)

_Type_: `shape`  
_Values_: { isFetching: [bool], appVersion: [string], libVersion: [string], deviceId: [string] }

The data for this props comes from the client connector.
