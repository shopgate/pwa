
# Changelog

### [1.3.0](https://github.com/shopgate/pwa-common/compare/v1.2.0...v1.3.0) - January 08, 2017

#### Added
- Observable `clientInformationDidUpdate$`

#### Fixed
- Images inside the product gallery are now shown on iOS 10

---

### [1.2.0](https://github.com/shopgate/pwa-common/compare/v1.1.3...v1.2.0) - January 08, 2017

#### Added
- Constant `CHECKOUT_PATH`
- Constant `LEGACY_URL`
- Constant `URL_TYPE_REGISTER`
- Selector `getHistoryLocation`
- Observable `openedRegisterLink`
- Opening the `/register` route will now trigger the fetching of a registration URL, if one is available

#### Changed
- The localstorage key now has the following format: `sgCloud-<appId>-<themeName>`. Different themes will no longer share the same storage space
- Converted `<List>` to be a stateless component

#### Removed
- Custom router lifecycle events `routeWillEnter` and `routeWillLeave`

---

### [1.1.3](https://github.com/shopgate/pwa-common/compare/v1.1.2...v1.1.3) - December 28, 2017

#### Fixed
- Updated `@shopgate/pwa-core` peer dependency to 1.1.x

---

### [1.1.2](https://github.com/shopgate/pwa-common/compare/v1.1.1...v1.1.2) - December 22, 2017

#### Changed
- Updated `@shopgate/pwa-core` to ^1.1.0

---

### [1.1.1](https://github.com/shopgate/pwa-common/compare/v1.1.0...v1.1.1) - December 22, 2017

#### Changed
- Reverted `react-id-swiper` to 1.4.0

---

### [1.1.0](https://github.com/shopgate/pwa-common/compare/v1.0.12...v1.1.0) - December 22, 2017

#### Added
- React 16 support

#### Changed
- Updated `@shopgate/eslint-config` to ^1.0.3
- Updated `@shopgate/pwa-unit-test` to ^1.3.0
- Updated `react` to ^16.2.0
- Updated `react-dom` to ^16.2.0
- Updated `react-id-swiper` to ^1.5.7
- Updated `react-tap-event-plugin` to ^3.0.2
- Updated `lint-staged` to ^4.3.0

---

### [1.0.12](https://github.com/shopgate/pwa-common/compare/v1.0.11...v1.0.12) - December 21, 2017

#### Added
- isAndroid selector
- Callback for closeInAppBrowser that will redirect to the received location from the event

#### Changed
- Updated `@shopgate/pwa-core` to ^1.0.5

---

### [1.0.11](https://github.com/shopgate/pwa-common/compare/v1.0.5...v1.0.11) - December 15, 2017

#### Added
- getClientInformation selector

---

### [1.0.5](https://github.com/shopgate/pwa-common/compare/v1.0.4...v1.0.5) - December 11, 2017

#### Changed
- Updated `@shopgate/pwa-core` to ^1.0.4

---

### [1.0.4](https://github.com/shopgate/pwa-common/compare/v1.0.3...v1.0.4) - December 11, 2017

#### Added
- Added a default callback for `viewDidDisappear`

#### Changed
- Updated `@shopgate/pwa-core` to ^1.0.3

#### Removed
- checkoutSuccess event registration on app start event

---

### [1.0.3](https://github.com/shopgate/pwa-common/compare/v1.0.2...v1.0.3) - December 7, 2017

#### Removed
- Default subscriptions to Observables

---

### [1.0.2](https://github.com/shopgate/pwa-common/compare/v1.0.1...v1.0.2) - December 7, 2017

#### Changed
- Updated `@shopgate/pwa-core` to ^1.0.0

---

### [1.0.1](https://github.com/shopgate/pwa-common/compare/v1.0.0...v1.0.1) - December 7, 2017

#### Changed
- Added a custom travis template for Slack
