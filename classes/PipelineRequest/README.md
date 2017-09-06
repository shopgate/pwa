# PipelineRequest

The PipelineRequest class extends [Request](../Request).
It provides functionality to deal with sending and receiving data requests.
A Promise gets returned when a request is sent.

## Usage

The PipelineRequest instance relies heavily on configuration by chaining it's methods.
The example below shows a common approach to send data to a *getProducts* backend end point:

```js
import PipelineRequest from './Request';

// Returns a Promise for further evaluation
return new PipelineRequest('getProducts')
  .setInput({ categoryId: 'someId' })
  .dispatch()
  .then((result) => {
    console.log('Result:', result);
    
    // Return the result so that the upper promise could proceed with it
    return result;
  });
```

## Methods and Properties

See the base [Request](../Request) class for common methods and properties.

### Properties

#### `name: string`

A name property is a concatinated version of the pipeline name and version, that is used internally.

### Methods

#### `constructor(name: string, [version: number]): void`

The constructor requires the name of the end point and also accepts a version number.
The version number defaults to the internal `CURRENT_VERSION`.

#### `setInput([payload: Object]): PipelineRequest`

This sets the payload data that the request should send.
The payload object accepts any serializable data structure and defaults to an empty object.

#### `setTrusted(): PipelineRequest`

Marks this request as trusted.

#### `setHandledErrors([errors: Array]): PipelineRequest`

Sets a list of error codes which will be handled within the reject callback of the Promise.
The error list defaults to an empty array.

#### `setErrorMessageWhitelist([errors: Array]): PipelineRequest`

Sets a list of error codes where the pipeline error message is used for the user error modal.
The error list defaults to an empty array.

#### `onDispatch(resolve: Function, reject: Function): void`

A callback that gets triggered when a request is sent.
It expects references to the resolve and reject Promise callback functions.
This method can be overridden by a child class.
