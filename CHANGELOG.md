
# Changelog
---
### [3.0.0](https://github.com/shopgate/theme-gmd/compare/v2.0.1...v3.0.0) - January 29, 2018
#### Added
- Added add/remove product to favorites on product detail page.
#### Changed
- Breaking change. Moved `Product.Header.AddToCartButton` to `Product.Header.CTAButtons` as a child component.
---
### [2.0.1](https://github.com/shopgate/theme-gmd/compare/v2.0.0...v2.0.1) - January 26, 2018
#### Added
- Translation file for Australia (AU).
---
### [2.0.0](https://github.com/shopgate/theme-gmd/compare/v1.3.0...v2.0.0) - January 25, 2018
#### Added
- Implemented Favorites page (`/favorite_list`). Favorites are not available for all shops. Feature is hidden behind a feature flag which can be changed using the shop configuration system.
- `SnackBar` component.
#### Changed
- `ProductProperites` and `ProductPrice` are moved to the shared `/components` folder
- Removed `Grid.Item` from `ProductProperites` and `ProductPrice` components
#### Fixed
- Fixed unit tests by updating snapshots due to `@shopgate/pwa-common` v.2.0.0 changes.
- Updated `@shopgate/pwa-common` to 2.0.1 version to get the `isNumeric` fix.
- Fixed MockedView component which didn't render any children before.
---
### [1.3.0](https://github.com/shopgate/theme-gmd/compare/v1.2.2...v1.3.0) - January 24, 2018
#### Added
- Tier Prices (aka Block Prices) feature to the product detail page.
#### Removed
- Background color of the product description.
- Spacing between Product Variants and Product Options selection.
#### Changed
- The properties inside each cart item now align to the bottom of the card.
- The spacing inside the sort dropdown has been adjusted.
- Font size and weight corrected inside the `<PaymentBar>`.
- Shadow is the `<AddToCartButton>` has been reduced.
- Various style changes to the Review feature.
#### Fixed
- The bottom padding of the cart page is now applied correctly, so that the payment bar doesn't overlay the coupon input.
- The ProductVariants component now works also if you have multiple product pages in your history. 
- Child products can be added to cart after leaving and going back to the product page.

---

### [1.2.2](https://github.com/shopgate/theme-gmd/compare/v1.2.1...v1.2.2) - January 17, 2018

#### Added
- Global CSS variables `--safe-area-inset-top` and `--safe-area-inset-bottom`
- Selector `getPageInsets`
- Constants for filter types `FILTER_TYPE_MULTISELECT` and `FILTER_TYPE_RANGE`
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

### [1.2.1](https://github.com/shopgate/theme-gmd/compare/v1.2.0...v1.2.1) - January 09, 2018

#### Changed
- `title` prop inside `<View>` defaults to an empty string (previously null)

#### Fixed
- Updated `@shopgate/pwa-common-commerce` to ^1.2.1
- Updated `@shopgate/pwa-tracking` to ^1.2.1

---

### [1.2.0](https://github.com/shopgate/theme-gmd/compare/v1.1.7...v1.2.0) - December 28, 2017

#### Added
- Messages for individual cart items are now displayed
- `classNames` prop to `<MessageBar>`

#### Removed
- Registration route …  business logic is (moved to `@shopgate/pwa-common`)

#### Changed
- Updated `@shopgate/pwa-common-commerce` to ^1.1.4

#### Fixed
- Page title now updated when navigating back
- `<FilterBar>` now does not flicker when rendering
- Updated `@shopgate/pwa-common` to ^1.2.0
- Updated `@shopgate/pwa-common-commerce` to ^1.2.0
- Updated `@shopgate/pwa-tracking` to ^1.2.0

---

### [1.1.7](https://github.com/shopgate/theme-gmd/compare/v1.1.6...v1.1.7) - December 28, 2017

#### Changed
- Updated `@shopgate/pwa-common-commerce` to ^1.1.4

#### Fixed
- Messages are now correctly displayed in the cart

---

### [1.1.6](https://github.com/shopgate/theme-gmd/compare/v1.1.5...v1.1.6) - December 28, 2017

#### Changed
- Updated `@shopgate/pwa-common` to ^1.1.3
- Updated `@shopgate/pwa-common-commerce` to ^1.1.3
- Updated `@shopgate/pwa-tracking` to ^1.1.2
- Updated `@shopgate/pwa-webcheckout-shopify` to ^1.1.2
- Updated `@shopgate/tracking-core` to ^1.0.8

---

### [1.1.5](https://github.com/shopgate/theme-gmd/compare/v1.1.4...v1.1.5) - December 22, 2017

#### Added
- React 16 support
- Dependency `react-hammerjs` via Github
- Dependency `react-tap-event-plugin` at ^3.0.2

#### Changed
- Updated `@shopgate/pwa-common` to ^1.1.2
- Updated `@shopgate/pwa-common-commerce` to ^1.1.2
- Updated `@shopgate/pwa-core` to ^1.1.0
- Updated `@shopgate/pwa-tracking` to ^1.1.1
- Updated `@shopgate/pwa-webcheckout-shopify` to ^1.1.1
- Updated `@shopgate/tracking-core` to ^1.0.7
- Updated `@shopgate/pwa-unit-test` to ^1.3.0
- Updated `@shopgate/react` to ^16.2.0
- Updated `@shopgate/react-dom` to ^16.2.0

---

### [1.1.4](https://github.com/shopgate/theme-gmd/compare/v1.1.3...v1.1.4) - December 22, 2017

#### Changed
- Updated `@shopgate/eslint-shopgate` to ^1.0.3
- Updated `@shopgate/pwa-tracking` to ^1.0.7

---

### [1.1.3](https://github.com/shopgate/theme-gmd/compare/v1.1.2...v1.1.3) - December 21, 2017

#### Changed
- Updated `@shopgate/pwa-common` to ^1.0.12
- Updated `@shopgate/pwa-common-commerce` to ^1.0.6
- Updated `@shopgate/pwa-core` to ^1.0.5
- Updated `@shopgate/pwa-webcheckout-shopify` to ^1.0.6
- Updated `@shopgate/tracking-core` to ^1.0.5

#### Fixed
- The product card will now correctly display the discount badge

---

### [1.1.2](https://github.com/shopgate/theme-gmd/compare/v1.1.1...v1.1.2) - December 19, 2017

#### Changed
- writeReview subscriber now uses the base product when getting a user review 

---

### [1.1.1](https://github.com/shopgate/theme-gmd/compare/v1.1.0...v1.1.1) - December 19, 2017

#### Added
- `noGap` prop to `<ActionButton>`
- `noGap` prop to `<ButtonLink>`

---

### [1.1.0](https://github.com/shopgate/theme-gmd/compare/v1.0.6...v1.1.0) - December 18, 2017

#### Added
- `hasFeatures` flag in `app.json`

#### Removed
- `features` flag in `app.json`

---

### [1.0.6](https://github.com/shopgate/theme-gmd/compare/v1.0.5...v1.0.6) - December 15, 2017

#### Added
- Component `<ButtonLink>`
- Locale string `reviews.press_to_rate_with_x_stars`
- Regular italic style for Roboto font
- Color `shade12` (#939393)
- Variables `gap.bigger`, `gap.xbig` and `gap.xxbig`

#### Changed
- `ClientInformation` connector now uses a selector to gather data
- `<AllReviewsLink>` now internally uses `<ButtonLink>`
- `<WriteReviews>` now internally uses `<ButtonLink>`
- Various styling adjustments relating to the Reviews feature
- Various styling adjustments relating to the Login feature
- Various styling adjustments relating to the  `<TextField>`
- Updated `@shopgate/pwa-common` to ^1.0.11
- Updated `@shopgate/pwa-common-commerce` to ^1.0.5
- Updated `@shopgate/pwa-tracking` to ^1.0.6
- Updated `@shopgate/pwa-webcheckout-shopify` to ^1.0.5
- Updated `@shopgate/tracking-core` to ^1.0.4

---

### [1.0.5](https://github.com/shopgate/theme-gmd/compare/v1.0.4...v1.0.5) - December 11, 2017

#### Added
- Locale string `price.currency`

#### Changed
- Imprint page link is now the last item in the Navigation Drawer

---

### [1.0.4](https://github.com/shopgate/theme-gmd/compare/v1.0.3...v1.0.4) - December 11, 2017

#### Changed
- Updated `@shopgate/pwa-common` to ^1.0.5
- Updated `@shopgate/pwa-common-commerce` to ^1.0.4
- Updated `@shopgate/pwa-core` to ^1.0.4
- Updated `@shopgate/pwa-tracking` to ^1.0.5
- Updated `@shopgate/pwa-webcheckout-shopify` to ^1.0.4
- Updated `@shopgate/tracking-core` to ^1.0.3

---

### [1.0.3](https://github.com/shopgate/theme-gmd/compare/v1.0.2...v1.0.3) - December 11, 2017

#### Added
- Locale string `price.msrp`

#### Removed
- Locale string `price.currency`

#### Changed
- Updated `@shopgate/pwa-common` to ^1.0.4
- Updated `@shopgate/pwa-common-commerce` to ^1.0.3
- Updated `@shopgate/pwa-core` to ^1.0.3
- Updated `@shopgate/pwa-tracking` to ^1.0.4
- Updated `@shopgate/pwa-webcheckout-shopify` to ^1.0.3
- Updated `@shopgate/tracking-core` to ^1.0.2

#### Fixed
- HTML widget container now has a CSS clear fix applied for floating elements

---

### [1.0.2](https://github.com/shopgate/theme-gmd/compare/v1.0.1...v1.0.2) - December 07, 2017

#### Added
- Included subscriptions from `pwa-common` and `pwa-tracking`. These subscriptions were previously injected as subscribers by default

#### Changed
- Updated `@shopgate/pwa-common` to ^1.0.3
- Updated `@shopgate/pwa-common-commerce` to ^1.0.2
- Updated `@shopgate/pwa-tracking` to ^1.0.2
- Updated `@shopgate/pwa-webcheckout-shopify` to ^1.0.2
- Updated `@shopgate/tracking-core` to ^1.0.1

---

### [1.0.1](https://github.com/shopgate/theme-gmd/compare/v1.0.0...v1.0.1) - December 07, 2017

#### Added
- The search field now uses a locale string, `search.placeholder`, if no placeholder is given

#### Changed
- The `getProductReviews` action is now dispatched from a subscription 
- Updated `@shopgate/pwa-common` to ^1.0.2
- Updated `@shopgate/pwa-common-commerce` to ^1.0.1
- Updated `@shopgate/pwa-core` to ^1.0.0
- Updated `@shopgate/pwa-tracking` to ^1.0.1
- Updated `@shopgate/pwa-webcheckout-shopify` to ^1.0.1
- Updated `@shopgate/tracking-core` to ^1.0.0

#### Fixed
- Product price on product route now will not overflow the viewport
- LiveShopping indicator styling is now correct
