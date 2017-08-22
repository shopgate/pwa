# Shopgate's Unit Test Suite

This test suite is a configuration for Shopgate's [ReactJS](https://facebook.github.io/react/) projects.

This configuration uses [Jest](https://facebook.github.io/jest/) for running the tests.
It is only an extension of the default Jest configuration and
prepares your tests for any React PWA using the Shopgate Cloud.

## Dependencies

The test suite has two peer dependencies. You need to install `enzyme@^2.9.1` and `jest@^20.0.4`
together with this package. This can be seen in the installation step:

## Installation

To install and use this package, you need to run the following command in your
project's root directory:

```sh
npm i @shopgate/pwa-unit-test enzyme jest --save-dev
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
    '^Components(.*)$': '<rootDir>/components',
    '^Styles(.*)$': '<rootDir>/styles',
  },
};
```
