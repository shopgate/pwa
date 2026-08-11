# Unit test setup for the Shopgate Connect PWA

This test suite is a configuration for Shopgate's [React](https://facebook.github.io/react/) projects.

**The unit test suite needs React to be installed in at least version ~16.2.0**

This configuration uses [Jest](https://facebook.github.io/jest/) for running the tests.
It is only an extension of the default Jest configuration and
prepares your tests for any React PWA using the [Shopgate Cloud](https://developer.shopgate.com).

## Installation

To install and use this package, you need to run the following command in your
project's root directory:

```sh
npm install @shopgate/pwa-unit-test --save-dev
```

## Usage

All test files should follow the naming convention of `*spec.(js|jsx)`.

You have two options of how to create a configuration for Jest:

- You can create your own configuration following the [Jest Documentation](https://facebook.github.io/jest/docs/en/getting-started.html)
- You can use Shopgate's pre-defined configuration and extend it as you wish.

__NOTE: Using and extending the Shopgate configuration is the preferred way!__

### 1. Using Shopgate's configuration

Create a file called `jest.config.js` in the root of your project.
Add the following line to it:

```js
module.exports = require('@shopgate/pwa-unit-test/jest.config');
```

### 2. Extending Shopgate's configuration

Create a file called `jest.config.js` in the root of your project.
Add the following line in the beginning of the file:

```js
const defaultConfig = require('@shopgate/pwa-unit-test/jest.config');
```

This will load the default configuration. Now you can extend it by spreading the `defaultConfig`
into a newly created configuration object:

```js
module.exports = {
  ...defaultConfig,
  [Your config goes here],
};
```

## Example Configuration

Here is an example showing how to extend the default configuration:

```js
const defaultConfig = require('@shopgate/pwa-unit-test/jest.config');

module.exports = {
  ...defaultConfig,
  moduleNameMapper: {
    // Keep the default mappings - they would be replaced otherwise
    ...defaultConfig.moduleNameMapper,
    '^Components(.*)$': '<rootDir>/components$1',
    '^Styles(.*)$': '<rootDir>/styles$1',
  },
};
```

__NOTE: Options which hold an object or an array - like `moduleNameMapper`, `setupFiles` or
`transformIgnorePatterns` - are replaced and not merged when they are set. Spread the value of the
default configuration first to keep it, as shown above. Without that, the mappings for styles and
assets are lost, and imports of stylesheets or images within the tested components fail.__

## Test utilities

### `createMockStore`

Creates a minimal Redux store for component tests. It implements the contract that `react-redux`
relies on, without pulling in the reducers of the application:

```js
import { createMockStore } from '@shopgate/pwa-unit-test/testUtils';

const store = createMockStore({ counter: 0 });

mount(
  <Provider store={store}>
    <MyComponent />
  </Provider>
);
```

Dispatched actions are recorded, so they can be asserted on. `store.dispatch` is a jest mock:

```js
expect(store.getActions()).toEqual([{ type: 'INCREMENT' }]);
expect(store.dispatch).toHaveBeenCalledWith({ type: 'INCREMENT' });

store.clearActions();
```

__NOTE: `getActions()` reads the recorded calls of the `dispatch` mock, so a `jest.clearAllMocks()`
- e.g. within a `beforeEach` - also clears the recorded actions. Create the store after that call,
or use `store.clearActions()` to reset only this store.__

By default the state doesn't change when an action is dispatched, which keeps it predictable. Use
`setState` to simulate a state change - the subscribers are notified, so connected components
re-render:

```js
store.setState({ counter: 5 });
store.setState(current => ({ counter: current.counter + 1 }));
```

Pass a reducer as second argument to also apply dispatched actions to the state, e.g. to assert
what a component renders after it dispatched something:

```js
const store = createMockStore({ counter: 0 }, (state, action) => (
  action.type === 'INCREMENT' ? { counter: state.counter + 1 } : state
));
```

## About Shopgate

Shopgate is the leading mobile commerce platform.

Shopgate offers everything online retailers need to be successful in mobile. Our leading
software-as-a-service (SaaS) enables online stores to easily create, maintain and optimize
native apps and mobile websites for the iPhone, iPad, Android smartphones and tablets.

## License

Unit test setup for the Shopgate Connect PWA is available under the Apache License, Version 2.0.

See the [LICENSE.md](./LICENSE.md) file for more information.
