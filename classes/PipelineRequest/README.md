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

## Testing - MockedPipelineRequest
### How to mock this module?

It's easy to test functions that are using PipelineRequest. The only thing which is important is that the tested function must return an original `Promise` when called. For example:
```js
// Redux action definition.
const fetchSomething = (...params) => () => {
  // First, create a promise by dispatching the request.
  const promise = new PipelineRequest('pipelineName').dispatch();
  // Then define the necessary promise callbacks.
  promise
    .then(() => {
      // Callback when pipeline request resolves.
    })
    .catch((e) => {
      // Callback when pipeline request fails.
    });
 
  return promise;
} 
```

When fetch action is implemented like in the example above, testing is pretty easy to implement. For example:
```js
// First import the original fetch function 
import fetchSomething from 'exampleFile';
// Then, import mockPipelineRequestFactory
import mockPipelineRequestFactory from '@shopgate/pwa-core/classes/PipelineRequest/mock';
// Now the PipelineRequest can be mocked.
jest.mock(
  '@shopgate/pwa-core/classes/PipelineRequest',
  () => (
    // The factory requires a callback function which will be called always when the `PipelineRequest.dispatch()` is called.
    mockedPipelineRequestFactory((mockedInstance, resolve, reject) => {
      // Here you can place your code that either resolves or rejects the promise.
      // For analytical purposes, the mocked dispatch also passes the MockedPipelineRequest instance (this).
      // This allows the test to analyze the internal data, like the effect of `PipelineRequest.setInput()` method.
    })
  )
)
```

## Mocked methods and properties
### Properties
#### `static mockedDispatchResolver: function(this, resolve, reject)`
A mock-specific property which contains a function that will be executed when the `.dispatch()` method is called.
#### `name: string`
The pipeline name which was passed when The MockedPipelineRequest was created. The mock doesn't use it, but keeps it for assertion.
#### `input: Object`
The object which was passed by `.setInput()` method. Defaults to an empty object.
### Methods
#### `setInput([payload: Object]): MockedPipelineRequest`
Sets the payload data and keeps it for further testing.
#### `dispatch()`
Returns a promise and resolves the promises immediately with a function stored as `.mockedDispatchResolver()` property.
