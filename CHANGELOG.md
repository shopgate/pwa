
# Changelog
---

### [1.3.0](https://github.com/shopgate/pwa-core/compare/v1.2....v1.3.0) - February 05, 2018
#### Added
- Introduced a new constant for invalid pipeline call errors

#### Removed
- Removed the `errorMessageWhitelist` property from the PipelineRequest object, since it wasn't used anymore

---

### [1.2.0](https://github.com/shopgate/pwa-core/compare/v1.1.1...v1.2.0) - January 25, 2018
#### Added
- `EFAVORITE` and `EBIGAPI` error codes

---

### [1.1.1](https://github.com/shopgate/pwa-core/compare/v1.1.0...v1.1.1) - January 24, 2018
#### Fixed
- Enabled console logging for "httpResponse" event errors.

---

### [1.1.0](https://github.com/shopgate/pwa-core/compare/v1.0.5...v1.1.0) - December 22, 2017

#### Changed
- Updated `@shopgate/eslint-config` to ^1.0.3
- Updated `jest` to ^22.0.4

---

### [1.0.5](https://github.com/shopgate/pwa-core/compare/v1.0.0...v1.0.5) - December 21, 2017

#### Added
- cleanTab command  
- closeInAppBrowser command  
- performCommandsAfterDelay command  
- setCommandParams method to AppCommand  

#### Removed
- index containing exports of all commands
- openCart command  
- openSearch command  
