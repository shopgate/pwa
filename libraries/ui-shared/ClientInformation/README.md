# ClientInformation


This component provides the user with information about the app and lib versions as well as the user's device ID. The device ID is only shown if the user touches and holds on the component for 5 seconds. Additionally a message is posted in #app_debug_logging and debug logging is enabled.

## Getting Started

```jsx
import ClientInformation from '../ClientInformation';

<ClientInformation />
```

## Props

### client (required)

_Type_: `shape`  
_Values_: `{ isFetching: [bool], appVersion: [string], libVersion: [string], deviceId: [string] }`

The data for this props comes from the client connector.

### enableDebugLogging (required)

_Type_: `function`  

Will be called when debug logging shall be enabled.
