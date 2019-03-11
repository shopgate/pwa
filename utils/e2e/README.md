# E2E Test integration of Cypress for the Shopgate Connect PWA

This is the Integration of [Cypress](https://www.cypress.io/) into the Shopgate PWA for E2E Testing.

## Execution
from pwa root folder:
```sh
npm run e2e:gmd 
npm run e2e:ios11
```

## Structure
### Supporting Files
```
|-- utils
  |-- LICENSE.md
  |-- README.md
  |-- package.json
  |-- fixtures
    |-- example.json
  |-- plugins
    |-- index.js
  |-- support
    |-- commands.js
    |-- index.js
  
```

The [Fixtures](https://docs.cypress.io/api/commands/fixture.html#Syntax) folder can store files with a set of data that can be used within tests.

The [Plugins](https://docs.cypress.io/guides/tooling/plugins-guide.html#) folder store the index.js for loading plugins into Cypress.

The [Support](https://on.cypress.io/custom-commands) folder can hold custom commands or overwritten commands.

### Tests
```
|-- gmd/ios11
  |-- cypress.json
  |-- integration
    |-- newTest.js
  |-- elements
    |-- de.js
  ```

The cypress.json is the configuration file for each test suite.(BaseUrl for each suite is stored here)

The integration folder stores all tests.

The elements folder stores all elements used in tests as strings.

## Instructions

Please configure the cypress.json to meet your enviroment. 

## Coverage report
A coverage report can be found in ./themes/"USED_THEME"/coverage as html output after a test run.

## About Shopgate

Shopgate is the leading mobile commerce platform.

Shopgate offers everything online retailers need to be successful in mobile. Our leading
software-as-a-service (SaaS) enables online stores to easily create, maintain and optimize
native apps and mobile websites for the iPhone, iPad, Android smartphones and tablets.

## License

E2E Test integration of Cypress for the Shopgate Connect PWA is available under the Apache License, 
Version 2.0.

See the [LICENSE.md](./LICENSE.md) file for more information.
