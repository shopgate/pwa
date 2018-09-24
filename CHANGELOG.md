# Changelog

### [2.2.0](https://github.com/shopgate/theme-gmd/compare/v2.1.0...v2.2.0) - February 07, 2018
#### Added
- Introduce the new app config `productPropertiesFilter` for whitelisting/blacklisting product properties.

### [2.1.0](https://github.com/shopgate/theme-gmd/compare/v2.0.2...v2.1.0) - February 07, 2018
#### Updated
- `pwa-common` dependency to `^2.3.0`.
- the reducer setup to use reducers from extension.
- the subscribers setup to use subscriptions from extensions.
- the translations setup to use translation strings from extensions.

### [2.0.2](https://github.com/shopgate/theme-gmd/compare/v2.0.1...v2.0.2) - February 06, 2018
#### Changed
- Layout of tier prices.
---
### [2.0.1](https://github.com/shopgate/theme-gmd/compare/v2.0.0...v2.0.1) - February 05, 2018
#### Fixed
- Re-enabled the configuration of custom theme colors by adding `?parsed=true` to the path of the `colors` setting within the `extension-config.json`

---
### [2.0.0](https://github.com/shopgate/theme-gmd/compare/v1.4.4...v2.0.0) - January 30, 2018
#### Updated
- Breaking change. Moved `RatingStars` out to the `@shopgate/ext-product-reviews` extension using portals.

---
### [1.4.2](https://github.com/shopgate/theme-gmd/compare/v1.4.1...v1.4.2) - January 26, 2018
#### Added
- Translation file for Australia (AU).

---
### [1.4.1](https://github.com/shopgate/theme-ios11/compare/v1.4.0...v1.4.1) - January 25, 2018
#### Changed
- Updated `@shopgate/pwa-common` to 2.0.1 version to get the `isNumeric` fix.

---
### [1.4.0](https://github.com/shopgate/theme-ios11/compare/v1.3.2...v1.4.0) - January 24, 2018
#### Added
- Tier Prices (aka Block Prices) Feature to the product detail page.
#### Changed
- Corrected some German translation strings.
#### Fixed
- The ProductVariants component now works also if you have multiple product pages in your history.
- Child products can be added to a cart after leaving and going back to the product page.
---

### [1.3.2](https://github.com/shopgate/theme-ios11/compare/v1.3.1...v1.3.2) - January 17, 2018

#### Added
- Global CSS variables `--safe-area-inset-top` and `--safe-area-inset-bottom`
- Selector `getPageInsets`
- Dependency `react-sizeme`

#### Changed
- Replaced the usage of `safe-area-insets` environment CSS constants with CSS variables that are set depending on the device
- Updated `@shopgate/pwa-common` to ^1.3.0
- Updated `@shopgate/pwa-common-commerce` to ^1.2.2
- Updated `@shopgate/pwa-tracking` to ^1.2.2
- Updated `@shopgate/pwa-webcheckout-shopify` to ^1.1.3

#### Fixed
- The product id that is set in the redux store is now not reset when navigating through product routes i.e. (gallery, reviews)
- The spacing reserved for the `PaymentBar` is now relative to the height of the component

---

### [1.3.1](https://github.com/shopgate/theme-ios11/compare/v1.3.0...v1.3.1) - January 09, 2018

#### Changed
- `title` prop inside `<View>` defaults to an empty string (previously null)
- Updated `@shopgate/pwa-common-commerce` to ^1.2.1
- Updated `@shopgate/pwa-tracking` to ^1.2.1

---

### [1.3.0](https://github.com/shopgate/theme-ios11/compare/v1.2.5...v1.3.0) - January 08, 2018

#### Added
- Messages for individual cart items are now displayed
- `classNames` prop to `<MessageBar>`

#### Removed
- Registration route …  business logic is (moved to `@shopgate/pwa-common`

#### Changed
- Updated `@shopgate/pwa-common` to ^1.2.0
- Updated `@shopgate/pwa-common-commerce` to ^1.2.0
- Updated `@shopgate/pwa-tracking` to ^1.2.0

#### Fixed
- Page title now updated when navigating back
 - `<FilterBar>` now does not flicker when rendering

---

### [1.2.5](https://github.com/shopgate/theme-ios11/compare/v1.2.4...v1.2.5) - December 28, 2017

#### Changed
- Updated `@shopgate/pwa-common-commerce` to ^1.1.4

#### Fixed
- Cart messages now appear when multiple items are in the cart

---

### [1.2.4](https://github.com/shopgate/theme-ios11/compare/v1.2.3...v1.2.4) - December 28, 2017

#### Changed
- Updated `@shopgate/pwa-common` to ^1.1.3
- Updated `@shopgate/pwa-common-commerce` to ^1.1.3
- Updated `@shopgate/pwa-tracking` to ^1.1.2
- Updated `@shopgate/pwa-webcheckout-shopify` to ^1.1.2
- Updated `@shopgate/tracking-core` to ^1.0.8

---

### [1.2.3](https://github.com/shopgate/theme-ios11/compare/v1.2.2...v1.2.3) - December 22, 2017

#### Added
- React 16 support

#### Changed
- Updated `@shopgate/pwa-common` to ^1.1.2
- Updated `@shopgate/pwa-common-commerce` to ^1.1.2
- Updated `@shopgate/pwa-core` to ^1.1.0
- Updated `@shopgate/pwa-tracking` to ^1.1.1
- Updated `@shopgate/pwa-webcheckout-shopify` to ^1.1.1
- Updated `@shopgate/tracking-core` to ^1.0.7
- Updated `@shopgate/pwa-unit-test` to ^1.3.0
- Updated `react` to ^16.2.0
- Updated `react-dom` to ^16.2.0
- Updated `react-tap-event-plugin` to ^3.0.2

---

### [1.2.2](https://github.com/shopgate/theme-ios11/compare/v1.2.1...v1.2.2) - December 22, 2017

#### Changed
- Updated `@shopgate/eslint-config` to ^1.0.3

---

### [1.2.1](https://github.com/shopgate/theme-ios11/compare/v1.2.0...v1.2.1) - December 21, 2017

#### Added
Locale string `navigation.about`

#### Changed
- Welcome message now includes the forename of the user, if they are logged in
- Updated `@shopgate/pwa-common` to ^1.0.12
- Updated `@shopgate/pwa-common-commerce` to ^1.0.6
- Updated `@shopgate/pwa-core` to ^1.0.5
- Updated `@shopgate/pwa-tracking` to ^1.0.7
- Updated `@shopgate/pwa-webcheckout-shopify` to ^1.0.6
- Updated `@shopgate/tracking-core` to ^1.0.5

#### Fixed
- Support for ‘The Notch’ now works on iOS 11.2.1
- The product card will now not show the display badge if the value is `0`

---

### [1.2.0](https://github.com/shopgate/theme-ios11/compare/v1.1.0...v1.2.0) - December 19, 2017

#### Added
- Product Reviews feature
- Product route subscription for all route based actions
- Component `ButtonLink`
- `hasFeatures` flag in `app.json`
- `noGap` prop to `<ActionButton>`
- `isSelectable` prop to `<RatingStars>`
- `onSelection` prop to `<RatingStars>`

#### Removed
- `features` flag in `app.json`

#### Changed
- `<AllReviewsLink>` now internally uses `<ButtonLink>`
- `<AllReviewsLink>` connector now gathers the id of the base product
- `<WriteReviews>` now internally uses `<ButtonLink>`
- Various styling adjustments relating to the Reviews feature
- Various styling adjustments relating to the Login feature
- Various styling adjustments relating to the `<TextField>`

---

### [1.1.0](https://github.com/shopgate/theme-ios11/compare/v1.0.6...v1.1.0) - December 19, 2017

#### Added
- iPhone X support
- `isFullescreen` prop to `<View>`

#### Changed
- `isFilterBarShown` selector is duplicated and moved away from the `<Filterbar>`, to each page where it is used
- `<ClientInformation>` connector now uses a selector to gather data
- The active filters are now not reset when the Category or Search route is entered

#### Fixed
- The TabBar is now hidden when navigating to the Filter route

---

### [1.0.6](https://github.com/shopgate/theme-ios11/compare/v1.0.5...v1.0.6) - December 15, 2017

#### Changed
- Updated `@shopgate/pwa-common` to ^1.0.11
- Updated `@shopgate/pwa-common-commerce` to ^1.0.5
- Updated `@shopgate/pwa-tracking` to ^1.0.6
- Updated `@shopgate/pwa-webcheckout-shopify` to ^1.0.5
- Updated `@shopgate/tracking-core` to ^1.0.4

#### Fixed
- `<CartButton>` badge is now correctly positioned

---

### [1.0.5](https://github.com/shopgate/theme-ios11/compare/v1.0.4...v1.0.5) - December 11, 2017

#### Added
- Locale string `price.currency`

---

### [1.0.4](https://github.com/shopgate/theme-ios11/compare/v1.0.3...v1.0.4) - December 11, 2017

#### Changed
- Updated `@shopgate/pwa-common` to ^1.0.5
- Updated `@shopgate/pwa-common-commerce` to ^1.0.4
- Updated `@shopgate/pwa-core` to ^1.0.4
- Updated `@shopgate/pwa-tracking` to ^1.0.5
- Updated `@shopgate/pwa-webcheckout-shopify` to ^1.0.4
- Updated `@shopgate/tracking-core` to ^1.0.3

---

### [1.0.3](https://github.com/shopgate/theme-ios11/compare/v1.0.2...v1.0.3) - December 11, 2017

#### Added
- Locale string `price.msrp`

#### Removed
- Locale string `price.currency`

#### Changed
- `<PriceStriked>` component now uses a locale string for `msrp`
- Updated `@shopgate/pwa-common` to ^1.0.4
- Updated `@shopgate/pwa-common-commerce` to ^1.0.3
- Updated `@shopgate/pwa-core` to ^1.0.3
- Updated `@shopgate/pwa-tracking` to ^1.0.4
- Updated `@shopgate/pwa-webcheckout-shopify` to ^1.0.3
- Updated `@shopgate/tracking-core` to ^1.0.2

#### Fixed
- Scrolling over the HTML widget will no longer open a link
- HTML widget container now has a CSS clear fix applied for floating elements

---

### [1.0.2](https://github.com/shopgate/theme-ios11/compare/v1.0.1...v1.0.2) - December 07, 2017

#### Added
- Included subscriptions from `pwa-common` and `pwa-tracking`. These subscriptions were previously injected as subscribers by default

#### Changed
- Updated `@shopgate/pwa-common` to ^1.0.3
- Updated `@shopgate/pwa-common-commerce` to ^1.0.2
- Updated `@shopgate/pwa-tracking` to ^1.0.2
- Updated `@shopgate/pwa-webcheckout-shopify` to ^1.0.2
- Updated `@shopgate/tracking-core` to ^1.0.1

---

### [1.0.1](https://github.com/shopgate/theme-ios11/compare/v1.0.0...v1.0.1) - December 07, 2017

#### Added
- The search field now uses a locale string, `search.placeholder`, if no placeholder is given

#### Changed
- Various style adjustments to the Product route
- Corrected `ORDERS_PATH` imports
- Updated `@shopgate/pwa-common` to ^1.0.2
- Updated `@shopgate/pwa-common-commerce` to ^1.0.1
- Updated `@shopgate/pwa-core` to ^1.0.0
- Updated `@shopgate/pwa-tracking` to ^1.0.1
- Updated `@shopgate/pwa-webcheckout-shopify` to ^1.0.1
- Updated `@shopgate/tracking-core` to ^1.0.0

#### Fixed
- Liveshopping indicator styling
