
# Changelog

## [Unreleased]
### Added
- New `Portal` constant `PAGE_LOGIN` and `PAGE_LOGIN_REGISTER_LINK` added.

### [2.4.0](https://github.com/shopgate/pwa-common/compare/v2.3.0...v2.4.0) - February 07, 2018
#### Added
- Toast messages supports an action button functionality
  
---

### [2.3.0](https://github.com/shopgate/pwa-common/compare/v2.2.0...v2.3.0) - February 07, 2018
#### Added
  * `mergeTranslations` helper function
  
---

### [2.2.0](https://github.com/shopgate/pwa-common/compare/v2.1.2...v2.2.0) - February 06, 2018
#### Added
- `generateResultHash` now includes a `includeFilters` parameter.
#### Changed
- Extended `unsetViewLoading` with `flush` variable that forces the action to reset loading view counter.

---

### [2.1.2](https://github.com/shopgate/pwa-common/compare/v2.1.1...v2.1.2) - February 05, 2018
#### Added
- Data attribute to Button component for automated testing
- Default `app.json` for test mode
- The `successLogin` action is now dispatched if a login pipeline request fails because the user is already logged in at the backed

#### Fixed
- Invalid portal components are now ignored

---
### [2.1.1](https://github.com/shopgate/pwa-common/compare/v2.1.0...v2.1.1) - February 01, 2018
#### Added
- Data attribute to Button component for automated testing
- Default `app.json` for test mode

#### Fixed
- Invalid portal components are now ignored

---

### [2.1.0](https://github.com/shopgate/pwa-common/compare/v2.0.2...v2.1.0) - January 30, 2018
#### Added
- `Portal` component and `PortalCollection` helper.

### [2.0.2](https://github.com/shopgate/pwa-common/compare/v2.0.1...v2.0.2) - January 29, 2018
#### Removed
- Widget type conversion

---

### [2.0.1](https://github.com/shopgate/pwa-common/compare/v2.0.0...v2.0.1) - January 25, 2018
#### Changed
- Removed `/favorite_list` from legacy links whitelist

#### Fixed
- Fixed `isNumeric` and `isNumber` problem with falsy validations for numeric strings.

---
### [2.0.0](https://github.com/shopgate/pwa-common/compare/v1.3.0...v2.0.0) - January 24, 2018
#### Added
- A new stream that emits when the "index" route was opened.
- A new history subscriber that listens on the opening of "index" routes and resets the history.
- Support for the "className" prop in the i18n FormatPrice component to support styling.
- Toast component.

#### Changed
- Combined related action creators to single files and updated the depending modules.

---

### [1.3.0](https://github.com/shopgate/pwa-common/compare/v1.2.0...v1.3.0) - January 08, 2018

#### Added
- Observable `clientInformationDidUpdate$`

#### Fixed
- Images inside the product gallery are now shown on iOS 10

---

### [1.2.0](https://github.com/shopgate/pwa-common/compare/v1.1.3...v1.2.0) - January 08, 2018

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
