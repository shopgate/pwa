# Request

Request is an abstract class that provides a basic outline for working with asynchronous requests.

## Usage

The Request class should not be used directly but you can use it to extend another class from it.

```js
import Request from './Request';

class PipelineRequest extends Request {
  // ...
}
```

See [PipelineRequest](../PipelineRequest) for further example.

## Methods and Properties

### Properties

#### `finished: boolean`

A flag that indicates whether the request is finished or not.

#### `manager: RequestManager`

A reference to the internally used manager instance.
This should only be set within the constructor.

### Methods

#### `constructor([manager: RequestManager]): void`

The constructor accepts a [RequestManager](../RequestManager) instance.
If no instance is passed it will use an internal default instance.

#### `hasPendingRequests(): boolean`

Indicates if the manager contains pending requests.

#### `createSerial(serialKey: string): void`

Creates an internal unique MD5 hash for this request by a given key.
A child class should provide this key.

**Example:**
```js
class CustomRequest extends Request {

  constructor(name) {
    super();

    this.createSerial(name);
    this.createEventCallbackName('customResponse');
  }
  
  // ...
}
```


#### `createEventCallbackName(callbackKey: string): void`

Creates an internal event callback name for this request by a given key.
A child class should provide this key.

**Example:**
```js
class CustomRequest extends Request {

  constructor(name) {
    super();

    this.createSerial(name);
    this.createEventCallbackName('customResponse');
  }
  
  // ...
}
```

#### `getEventCallbackName(): string`

Returns the internal event callback name for this request.

#### `dispatch(): Promise`

Sends the request and returns a Promise for further evaluation.

#### `onTimeout(resolve: Function, reject: Function): void`

A callback that gets triggered when a request exceeds it's time limit.
It expects references to the resolve and reject Promise callback functions.
This method can be overridden by a child class.

**Example:**
```js
onTimeout(resolve, reject) {
  logger.error('Request timeout');
  reject('Request timeout');
}
```
