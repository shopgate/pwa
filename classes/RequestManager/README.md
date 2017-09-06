# RequestManager

The RequestManager class handles processing of requests and propagation of received responses.

## Usage

An instance of a RequestManager should be passed to any [Request](../Request) constructor.
By default an internal instance is used.

## Methods and Properties

### Properties

#### `processingMode: string`

A string that defines the processing mode for the managed requests.
The available modes can be found in [RequestManagerModes](../../constants/RequestManagerModes.js).

#### `propagationMode: string`

A string that defines the propagation mode for the managed requests.
The available modes can be found in [RequestManagerModes](../../constants/RequestManagerModes.js).

#### `requestQueue: Array`

A list of all managed requests.

#### `pendingRequests: number`

The amount of currently pending requests (e.g. dispatched requests).

#### `timeout: number`

The amount of miliseconds after when a pending request is considered timed out.
A timeout value of 0 is considered that timeout handling is disabled.

### Methods

#### `constructor([options: Object]): void`

The constructor accepts options that can contain the following properties with default values:

```js
{
  processingMode = PROCESS_ANY,
  propagationMode = PROPAGATE_SINGLE,
  timeout = 0
} 
```

#### `handleDispatch(request: Request, resolve: Function, reject: Function): void`

Handles a dispatched request according to the `processingMode`.
Therefore this method expects the actual request instance and
the corresponding resolve and reject Promise callbacks. 

#### `handleError(request: Request, reject: Function, [message: string]): void`

Handles an error that occurred during the request.
Therefore this method expects the actual request instance and
the corresponding reject Promise callback with an optional error message.

#### `handleResponse(request: Request, resolve: Function, response: Object): void`

Handles a received request response according to the `processingMode`.
Therefore this method expects the actual request instance, 
the corresponding resolve Promise callback and the request response.
