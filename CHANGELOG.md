# Changelog

## [v6.5.4](https://github.com/shopgate/pwa/compare/v6.5.3...v6.5.4) (2019-07-05)

#### :bug: Bug Fix
* [#754](https://github.com/shopgate/pwa/pull/754) Fixed an issue with the Ellipsis component ([@fkloes](https://github.com/fkloes))
* [#745](https://github.com/shopgate/pwa/pull/745) Start page renders immediately when React is ready. ([@sznowicki](https://github.com/sznowicki))
* [#741](https://github.com/shopgate/pwa/pull/741) Onload command is independent of clientInformation ([@sznowicki](https://github.com/sznowicki))
* [#724](https://github.com/shopgate/pwa/pull/724) Handle external media provider scripts without blocking app start ([@alexbridge](https://github.com/alexbridge))


## [v6.5.3](https://github.com/shopgate/pwa/compare/v6.5.2...v6.5.3) (2019-06-28)

#### :bug: Bug Fix
* [#714](https://github.com/shopgate/pwa/pull/714) Applied react-hot-loader patch to the themes ([@SG-Noxoreos](https://github.com/SG-Noxoreos))
* [#713](https://github.com/shopgate/pwa/pull/713) Changed shopify-webcheckout url logic to accept a full domain over the alias for the web-login. ([@SG-Noxoreos](https://github.com/SG-Noxoreos))


## [v6.5.2](https://github.com/shopgate/pwa/compare/v6.5.1...v6.5.2) (2019-06-24)

#### :bug: Bug Fix
* [#708](https://github.com/shopgate/pwa/pull/708) Portuguese pt-PT locale for user privacy labels ([@alexbridge](https://github.com/alexbridge))


## [v6.5.1](https://github.com/shopgate/pwa/compare/v6.5.0...v6.5.1) (2019-06-13)

#### :rocket: Enhancement
* [#679](https://github.com/shopgate/pwa/pull/679) Added portuguese translations to the privacy extension ([@fkloes](https://github.com/fkloes))
* [#675](https://github.com/shopgate/pwa/pull/675) Updated dutch translations ([@fkloes](https://github.com/fkloes))
* [#673](https://github.com/shopgate/pwa/pull/673) Action is added to clear redux entries (product, categories, etc) ([@alexbridge](https://github.com/alexbridge))
* [#672](https://github.com/shopgate/pwa/pull/672) Add portal for scanner instructions on scanner bar ([@alexbridge](https://github.com/alexbridge))

#### :bug: Bug Fix
* [#696](https://github.com/shopgate/pwa/pull/696) Fixed incorrect price display on the product detail page when options are involved. ([@SG-Noxoreos](https://github.com/SG-Noxoreos))
* [#682](https://github.com/shopgate/pwa/pull/682) Support empty defaults for elements of type select in Form Builder with required flag ([@alexbridge](https://github.com/alexbridge))
* [#681](https://github.com/shopgate/pwa/pull/681) Handle not found product on Product Detail Page ([@alexbridge](https://github.com/alexbridge))
* [#676](https://github.com/shopgate/pwa/pull/676) Fixed NavDrawer Header update when user name was updated ([@fkloes](https://github.com/fkloes))
* [#677](https://github.com/shopgate/pwa/pull/677) Fixed wrapping "goto cart" button label within the iOS theme in pt-PT ([@fkloes](https://github.com/fkloes))
* [#665](https://github.com/shopgate/pwa/pull/665) Fixed a slider issue with swiping through zoomed slides ([@fkloes](https://github.com/fkloes))
* [#662](https://github.com/shopgate/pwa/pull/662) Fix date type field for ui-shared/Form package ([@alexbridge](https://github.com/alexbridge))


## [v6.5.0](https://github.com/shopgate/pwa/compare/v6.4.3...v6.5.0) (2019-06-03)

#### :rocket: Enhancement
* [#641](https://github.com/shopgate/pwa/pull/641) Improved extensibility of the scanner ([@fkloes](https://github.com/fkloes))
* [#637](https://github.com/shopgate/pwa/pull/637) Added Portals around the Tax Component within the PaymentBar ([@fkloes](https://github.com/fkloes))
* [#634](https://github.com/shopgate/pwa/pull/634) The ProductGrid component is now part of the Theme API ([@devbucket](https://github.com/devbucket))
* [#630](https://github.com/shopgate/pwa/pull/630) Navigation functions can be injected via React Hooks and HOCs. ([@devbucket](https://github.com/devbucket))
* [#631](https://github.com/shopgate/pwa/pull/631) Added extensibility of the app footer ([@fkloes](https://github.com/fkloes))
* [#622](https://github.com/shopgate/pwa/pull/622) Implemented translation system for cart and cart item messages. ([@SG-Noxoreos](https://github.com/SG-Noxoreos))
* [#627](https://github.com/shopgate/pwa/pull/627) Replaced scanner flash icon for disabled flashlight to make it more clear what it does ([@SG-Noxoreos](https://github.com/SG-Noxoreos))
* [#624](https://github.com/shopgate/pwa/pull/624) Added support for Portuguese language. ([@devbucket](https://github.com/devbucket))
* [#616](https://github.com/shopgate/pwa/pull/616) Add theme, router and current product, React Hooks and HOC to easily access the appropriate data ([@devbucket](https://github.com/devbucket))
* [#615](https://github.com/shopgate/pwa/pull/615) Improved rendering of videos within product descriptions and the HTML widget ([@fkloes](https://github.com/fkloes))
* [#598](https://github.com/shopgate/pwa/pull/598) Introduced @shopgate/engage package to start new API ([@devbucket](https://github.com/devbucket))
* [#597](https://github.com/shopgate/pwa/pull/597) Added a camera permission check before the scanner route is opened ([@fkloes](https://github.com/fkloes))
* [#595](https://github.com/shopgate/pwa/pull/595) Added possibility to implement custom UI for product options ([@alexbridge](https://github.com/alexbridge))
* [#594](https://github.com/shopgate/pwa/pull/594) The theme's color variables and global font variables are now configurable via the New Merchant Admin ([@devbucket](https://github.com/devbucket))

#### :bug: Bug Fix
* [#680](https://github.com/shopgate/pwa/pull/680) The `font` property in the theme config has been changed to `typography` ([@devbucket](https://github.com/devbucket))
* [#646](https://github.com/shopgate/pwa/pull/646) Fixed missing focus and contrast colors ([@fkloes](https://github.com/fkloes))
* [#638](https://github.com/shopgate/pwa/pull/638) Remove product data, when product is no more available ([@alexbridge](https://github.com/alexbridge))
* [#636](https://github.com/shopgate/pwa/pull/636) Corrected login.email translations for locales nl-NL and fr-FR. ([@SG-Noxoreos](https://github.com/SG-Noxoreos))
* [#635](https://github.com/shopgate/pwa/pull/635) Corrected the cart total discount label from plural to singular ([@fkloes](https://github.com/fkloes))
* [#633](https://github.com/shopgate/pwa/pull/633) The Swiper items now have equal heights ([@devbucket](https://github.com/devbucket))
* [#629](https://github.com/shopgate/pwa/pull/629) Introduced a configuration to limit favorite list item count ([@alexbridge](https://github.com/alexbridge))
* [#632](https://github.com/shopgate/pwa/pull/632) Fixed inconsistent UI logged in state when a getUser request failed ([@fkloes](https://github.com/fkloes))
* [#628](https://github.com/shopgate/pwa/pull/628) Added rxjs operator `mergeMap` to the main stream ([@SG-Noxoreos](https://github.com/SG-Noxoreos))
* [#625](https://github.com/shopgate/pwa/pull/625) Fixed an issue with scanning QR Code links that lead to non existent pages ([@fkloes](https://github.com/fkloes))
* [#623](https://github.com/shopgate/pwa/pull/623) Fixed the Scanner to directly open the found item, when the search result only contains one item ([@SG-Noxoreos](https://github.com/SG-Noxoreos))
* [#621](https://github.com/shopgate/pwa/pull/621) Fixed broken handling of channel urls ([@fkloes](https://github.com/fkloes))
* [#618](https://github.com/shopgate/pwa/pull/618) Add missing country ME ([@alexbridge](https://github.com/alexbridge))
* [#612](https://github.com/shopgate/pwa/pull/612) Ignore unknown country in form builder country field ([@alexbridge](https://github.com/alexbridge))
* [#610](https://github.com/shopgate/pwa/pull/610) Avoid screen overflow for select form element ([@alexbridge](https://github.com/alexbridge))
* [#607](https://github.com/shopgate/pwa/pull/607) Added missing french translation for search placeholder ([@devbucket](https://github.com/devbucket))
* [#600](https://github.com/shopgate/pwa/pull/600) Fallback to null when no shipping is given ([@alexbridge](https://github.com/alexbridge))
* [#599](https://github.com/shopgate/pwa/pull/599) Fix for customizing theme colors ([@alexbridge](https://github.com/alexbridge))
* [#596](https://github.com/shopgate/pwa/pull/596) Open social media app deeplinks natively ([@alexbridge](https://github.com/alexbridge))
* [#591](https://github.com/shopgate/pwa/pull/591) Fixed an issue with GET parameters inside of coupon deeplinks ([@fkloes](https://github.com/fkloes))

#### :nail_care: Polish
* [#639](https://github.com/shopgate/pwa/pull/639) Update tax and shipping disclaimers translations ([@alexbridge](https://github.com/alexbridge))
* [#609](https://github.com/shopgate/pwa/pull/609) Removed duplicate getUserLogin selector ([@devbucket](https://github.com/devbucket))


## [v6.4.2](https://github.com/shopgate/pwa/compare/v6.4.1...v6.4.2) (2019-05-16)

#### :bug: Bug Fix
* [#652](https://github.com/shopgate/pwa/pull/652) Fixed broken handling of channel urls ([@fkloes](https://github.com/fkloes))
* [#654](https://github.com/shopgate/pwa/pull/654) Fixed an issue where product sliders widgets didn't update on state updates ([@fkloes](https://github.com/fkloes))
* [#651](https://github.com/shopgate/pwa/pull/651) Sliders now render correctly when the slides are updated ([@fkloes](https://github.com/fkloes))


## [v6.4.1](https://github.com/shopgate/pwa/compare/v6.4.0...v6.4.1) (2019-04-24)

#### :bug: Bug Fix
* [#626](https://github.com/shopgate/pwa/pull/626) Fixed an issue with GET parameters inside of coupon deeplinks ([@fkloes](https://github.com/fkloes))


## [v6.4.0](https://github.com/shopgate/pwa/compare/v6.3.2...v6.4.0) (2019-04-10)

#### :rocket: Enhancement
* [#606](https://github.com/shopgate/pwa/pull/606) Extended the scanner event listeners to register for specific payload formats ([@fkloes](https://github.com/fkloes))
* [#601](https://github.com/shopgate/pwa/pull/601) Automated changelog creation ([@SG-Noxoreos](https://github.com/SG-Noxoreos))
* [#589](https://github.com/shopgate/pwa/pull/589) The cart now display correct and consistent data in the totals. ([@devbucket](https://github.com/devbucket))
* [#588](https://github.com/shopgate/pwa/pull/588) Add portals wrapping the View Content ([@alexbridge](https://github.com/alexbridge))
* [#577](https://github.com/shopgate/pwa/pull/577) Implementation of the Barcode Scanner UI ([@fkloes](https://github.com/fkloes))
* [#573](https://github.com/shopgate/pwa/pull/573) Show QR Code Scan results ([@alexbridge](https://github.com/alexbridge))
* [#574](https://github.com/shopgate/pwa/pull/574) Unused selectors for UI and toast messages have been removed. ([@devbucket](https://github.com/devbucket))
* [#572](https://github.com/shopgate/pwa/pull/572) The unused currentProduct reducer is removed from the default redux store. ([@devbucket](https://github.com/devbucket))
* [#570](https://github.com/shopgate/pwa/pull/570) Show Barcode Scan results (basic) ([@alexbridge](https://github.com/alexbridge))
* [#565](https://github.com/shopgate/pwa/pull/565) Add possibility to hide and replace the TabBar for the iOS theme ([@alexbridge](https://github.com/alexbridge))
* [#564](https://github.com/shopgate/pwa/pull/564) Restructured PaymentBar and added Portals around cart totals ([@fkloes](https://github.com/fkloes))

#### :bug: Bug Fix
* [#614](https://github.com/shopgate/pwa/pull/614) Keep shipping costs selector ([@alexbridge](https://github.com/alexbridge))
* [#606](https://github.com/shopgate/pwa/pull/606) Extended the scanner event listeners to register for specific payload formats ([@fkloes](https://github.com/fkloes))
* [#603](https://github.com/shopgate/pwa/pull/603) Add coupon + product to cart when QR code is scanned ([@alexbridge](https://github.com/alexbridge))
* [#593](https://github.com/shopgate/pwa/pull/593) Fixed swiper open link actions ([@SG-Noxoreos](https://github.com/SG-Noxoreos))
* [#590](https://github.com/shopgate/pwa/pull/590) Patch for e2e tests for new slider implementation ([@alexbridge](https://github.com/alexbridge))
* [#571](https://github.com/shopgate/pwa/pull/571) Refactored the Sliders to use the new react-id-swiper version ([@devbucket](https://github.com/devbucket))
* [#576](https://github.com/shopgate/pwa/pull/576) Sentry.io level / severity is not send correctly ([@alexbridge](https://github.com/alexbridge))
* [#575](https://github.com/shopgate/pwa/pull/575) The routeDidChange$ stream is now an alias of routeDidEnter$ since it is already deprecated. ([@devbucket](https://github.com/devbucket))
* [#569](https://github.com/shopgate/pwa/pull/569) Fix navigation with special characters in search query ([@alexbridge](https://github.com/alexbridge))
* [#567](https://github.com/shopgate/pwa/pull/567) Add shop number back to localstorage key of redux store ([@alexbridge](https://github.com/alexbridge))
* [#562](https://github.com/shopgate/pwa/pull/562) Liveshopping widget localization to german ([@alexbridge](https://github.com/alexbridge))

#### :nail_care: Polish
* [#586](https://github.com/shopgate/pwa/pull/586) Added changelog starting from PWA version 6.0.0 ([@SG-Noxoreos](https://github.com/SG-Noxoreos))


## [v6.3.2](https://github.com/shopgate/pwa/compare/v6.3.1...v6.3.2) (2019-05-05)

#### :bug: Bug Fix
* [#604](https://github.com/shopgate/pwa/pull/604) Open social media app deeplinks natively ([@alexbridge](https://github.com/alexbridge))


## [v6.3.1](https://github.com/shopgate/pwa/compare/v6.3.0...v6.3.1) (2019-03-20)

#### :bug: Bug Fix
* [#578](https://github.com/shopgate/pwa/pull/578) Sentry.io level / severity is not send correctly for PWA 6.3.1 ([@alexbridge](https://github.com/alexbridge))


## [v6.3.0](https://github.com/shopgate/pwa/compare/v6.2.1...v6.3.0) (2019-03-18)

#### :rocket: Enhancement
* [#555](https://github.com/shopgate/pwa/pull/555) Improve error behaviour for tracking core plugin calls ([@alexbridge](https://github.com/alexbridge))
* [#554](https://github.com/shopgate/pwa/pull/554) Implement sentry.io for javascript error logging for engage app ([@alexbridge](https://github.com/alexbridge))
* [#551](https://github.com/shopgate/pwa/pull/551) Implement sentry.io for javascript error logging for engage app ([@alexbridge](https://github.com/alexbridge))
* [#548](https://github.com/shopgate/pwa/pull/548) Selecting a Product Variant does not replace the route anymore. ([@devbucket](https://github.com/devbucket))
* [#550](https://github.com/shopgate/pwa/pull/550) Cleaned up Portal positions ([@fkloes](https://github.com/fkloes))
* [#544](https://github.com/shopgate/pwa/pull/544) Added the possibility of handling a pipeline error response containing multiple errors ([@SG-Noxoreos](https://github.com/SG-Noxoreos))

#### :bug: Bug Fix
* [#560](https://github.com/shopgate/pwa/pull/560) Make start page content load after window load event ([@alexbridge](https://github.com/alexbridge))
* [#557](https://github.com/shopgate/pwa/pull/557) Expire page configs on every app start ([@alexbridge](https://github.com/alexbridge))
* [#556](https://github.com/shopgate/pwa/pull/556) Correct handling of concurrent cart requests when adding a coupon with deeplink ([@alexbridge](https://github.com/alexbridge))
* [#558](https://github.com/shopgate/pwa/pull/558) Fix PRODUCT_ITEM_PRICE_AFTER Portal positioning  ([@alexbridge](https://github.com/alexbridge))
* [#549](https://github.com/shopgate/pwa/pull/549) Fix e2e tests. Run tests by webhook ([@alexbridge](https://github.com/alexbridge))
* [#545](https://github.com/shopgate/pwa/pull/545) Fixed broken cart layout at long availability texts ([@fkloes](https://github.com/fkloes))
* [#542](https://github.com/shopgate/pwa/pull/542) Show variants modal selection on favorite list when product has options ([@alexbridge](https://github.com/alexbridge))
* [#543](https://github.com/shopgate/pwa/pull/543) Fix for text hint below text input options with zero rendered price ([@alexbridge](https://github.com/alexbridge))


## [v6.2.1](https://github.com/shopgate/pwa/compare/v6.2.0...v6.2.1) (2019-03-07)

#### :bug: Bug Fix
* [#553](https://github.com/shopgate/pwa/pull/553) Fixed locales in theme-gmd and theme-ios11 ([@SG-Noxoreos](https://github.com/SG-Noxoreos))
* [#552](https://github.com/shopgate/pwa/pull/552) The pwa-benchmark npm package is now published in transpiled state. ([@SG-Noxoreos](https://github.com/SG-Noxoreos))


## [v6.2.0](https://github.com/shopgate/pwa/compare/v6.1.1...v6.2.0) (2019-02-27)

#### :rocket: Enhancement
* [#536](https://github.com/shopgate/pwa/pull/536) Check issues of Browser Connector with Cypress Tests ([@alexbridge](https://github.com/alexbridge))
* [#538](https://github.com/shopgate/pwa/pull/538) Added missing props to the ProductCard from the themeApi ([@fkloes](https://github.com/fkloes))
* [#530](https://github.com/shopgate/pwa/pull/530) Implemented the NestedCategoryFilterWidget ([@fkloes](https://github.com/fkloes))
* [#525](https://github.com/shopgate/pwa/pull/525) Added additional translations for user-privacy extension ([@fkloes](https://github.com/fkloes))
* [#514](https://github.com/shopgate/pwa/pull/514) Force refresh product stock information after checkout ([@alexbridge](https://github.com/alexbridge))
* [#511](https://github.com/shopgate/pwa/pull/511) Display text input options on PDP ([@alexbridge](https://github.com/alexbridge))
* [#498](https://github.com/shopgate/pwa/pull/498) Sort order param for get highlighted products action is added ([@alexbridge](https://github.com/alexbridge))
* [#508](https://github.com/shopgate/pwa/pull/508) Add ellipsis for product properties in a cart view ([@alexbridge](https://github.com/alexbridge))
* [#492](https://github.com/shopgate/pwa/pull/492) Added ProductSlider to the ThemeContext ([@richardgorman](https://github.com/richardgorman))
* [#490](https://github.com/shopgate/pwa/pull/490) Added ProductCard to ThemeAPI ([@richardgorman](https://github.com/richardgorman))
* [#433](https://github.com/shopgate/pwa/pull/433) Added inset padding to Material AppBar. AppBar in GMD now renders outside of View content ([@richardgorman](https://github.com/richardgorman))

#### :bug: Bug Fix
* [#547](https://github.com/shopgate/pwa/pull/547) Fixed broken disabled characteristic sheet items on iOS ([@fkloes](https://github.com/fkloes))
* [#540](https://github.com/shopgate/pwa/pull/540) Wrong page tracked when user comes back after checkout ([@alexbridge](https://github.com/alexbridge))
* [#539](https://github.com/shopgate/pwa/pull/539) The AppBar in iOS is only rendered when its target container has mounted ([@devbucket](https://github.com/devbucket))
* [#538](https://github.com/shopgate/pwa/pull/538) Added missing props to the ProductCard from the themeApi ([@fkloes](https://github.com/fkloes))
* [#533](https://github.com/shopgate/pwa/pull/533) Improve commerce/product/getBaseProductId selector ([@alexbridge](https://github.com/alexbridge))
* [#528](https://github.com/shopgate/pwa/pull/528) Enable parent product cart button when it has variants to select ([@alexbridge](https://github.com/alexbridge))
* [#526](https://github.com/shopgate/pwa/pull/526) Fixed the possibility of adding spaces to the end of a search term  ([@fkloes](https://github.com/fkloes))
* [#522](https://github.com/shopgate/pwa/pull/522) Fix White page on selecting certain input option (select option) ([@alexbridge](https://github.com/alexbridge))


## [v6.1.1](https://github.com/shopgate/pwa/compare/v6.1.0...v6.1.1) (2019-02-13)

#### :bug: Bug Fix
* [#532](https://github.com/shopgate/pwa/pull/532) Fixed wrong tracking events ([@fkloes](https://github.com/fkloes))
* [#531](https://github.com/shopgate/pwa/pull/531) Fixed a bug where the router throws an error when running a theme in standalone. ([@devbucket](https://github.com/devbucket))


## [v6.1.0](https://github.com/shopgate/pwa/compare/v6.0.1...v6.1.0) (2019-02-07)

#### :rocket: Enhancement
* [#524](https://github.com/shopgate/pwa/pull/524) Added portals to the PaymentBar component. ([@DannyShopgate](https://github.com/DannyShopgate))
* [#517](https://github.com/shopgate/pwa/pull/517) Added props to the store info section portals of the NavDrawer ([@fkloes](https://github.com/fkloes))
* [#518](https://github.com/shopgate/pwa/pull/518) Provide the ProductContext via the Theme API ([@devbucket](https://github.com/devbucket))
* [#516](https://github.com/shopgate/pwa/pull/516) Changed getPageConfig and getUser redux actions to fetch... to match the API ([@devbucket](https://github.com/devbucket))
* [#507](https://github.com/shopgate/pwa/pull/507) Changed more menu styling and aligned theme ios11 and gmd designs to be more compatible ([@SG-Noxoreos](https://github.com/SG-Noxoreos))
* [#506](https://github.com/shopgate/pwa/pull/506) Always render RATING_* portals on PDP ([@alexbridge](https://github.com/alexbridge))
* [#503](https://github.com/shopgate/pwa/pull/503) Improved extensibility of the NavDrawer and More page ([@fkloes](https://github.com/fkloes))
* [#491](https://github.com/shopgate/pwa/pull/491) Wrapped all AppBar presets in the themes with additional portal make it possible to extend it ([@devbucket](https://github.com/devbucket))
* [#501](https://github.com/shopgate/pwa/pull/501) Improved PWA pre-commit hook ([@fkloes](https://github.com/fkloes))
* [#494](https://github.com/shopgate/pwa/pull/494) Added portal props for GMD NavDrawer ([@richardgorman](https://github.com/richardgorman))
* [#493](https://github.com/shopgate/pwa/pull/493) Re-enabled SubMenu Headers in GMD NavDrawer ([@richardgorman](https://github.com/richardgorman))
* [#474](https://github.com/shopgate/pwa/pull/474) Add new actions to manipulate product meta data and fixed Sheet ([@Carsten89](https://github.com/Carsten89))
* [#486](https://github.com/shopgate/pwa/pull/486) Added AppBar portals ([@richardgorman](https://github.com/richardgorman))
* [#485](https://github.com/shopgate/pwa/pull/485) Added Drawer theme component to ThemeContext ([@richardgorman](https://github.com/richardgorman))
* [#479](https://github.com/shopgate/pwa/pull/479) Liveshopping widget refactoring ([@richardgorman](https://github.com/richardgorman))
* [#478](https://github.com/shopgate/pwa/pull/478) Fixed invalid it-IT language file ([@fkloes](https://github.com/fkloes))
* [#473](https://github.com/shopgate/pwa/pull/473) Change login action to support different strategies (facebook, etc) ([@alexbridge](https://github.com/alexbridge))
* [#468](https://github.com/shopgate/pwa/pull/468) Fixed some minor issues and hick-ups in the commerce selectors. ([@devbucket](https://github.com/devbucket))
* [#470](https://github.com/shopgate/pwa/pull/470) Routing extensibility improvements ([@richardgorman](https://github.com/richardgorman))
* [#441](https://github.com/shopgate/pwa/pull/441) Restore lost portal, adjust cypress tests ([@alexbridge](https://github.com/alexbridge))
* [#459](https://github.com/shopgate/pwa/pull/459) Update Spanish translations ([@Bettina-Baumert](https://github.com/Bettina-Baumert))
* [#462](https://github.com/shopgate/pwa/pull/462) Modified HttpRequest class in core ([@DannyShopgate](https://github.com/DannyShopgate))
* [#456](https://github.com/shopgate/pwa/pull/456) Reset margin of Register links ([@richardgorman](https://github.com/richardgorman))
* [#444](https://github.com/shopgate/pwa/pull/444) Removed text selection for product descriptions ([@richardgorman](https://github.com/richardgorman))
* [#436](https://github.com/shopgate/pwa/pull/436) Removed non-memoized function call from connector ([@richardgorman](https://github.com/richardgorman))
* [#435](https://github.com/shopgate/pwa/pull/435) Added support to add multiple products to the cart with the addProductsToCartAction ([@fkloes](https://github.com/fkloes))

#### :bug: Bug Fix
* [#523](https://github.com/shopgate/pwa/pull/523) Fixed updating of the search term on the search page ([@fkloes](https://github.com/fkloes))
* [#520](https://github.com/shopgate/pwa/pull/520) Fixed ImageSliderWidget update when the startpage was updated ([@fkloes](https://github.com/fkloes))
* [#519](https://github.com/shopgate/pwa/pull/519) Updated Conductor in favor of a bug fix with resetting the router stack. ([@devbucket](https://github.com/devbucket))
* [#517](https://github.com/shopgate/pwa/pull/517) Added props to the store info section portals of the NavDrawer ([@fkloes](https://github.com/fkloes))
* [#513](https://github.com/shopgate/pwa/pull/513) Fixed scroll position maintenance ([@devbucket](https://github.com/devbucket))
* [#505](https://github.com/shopgate/pwa/pull/505) Update conductor module to fix history reset ([@alexbridge](https://github.com/alexbridge))
* [#502](https://github.com/shopgate/pwa/pull/502) Introduced a reducer to receive updates from the router at the right time ([@devbucket](https://github.com/devbucket))
* [#503](https://github.com/shopgate/pwa/pull/503) Improved extensibility of the NavDrawer and More page ([@fkloes](https://github.com/fkloes))
* [#497](https://github.com/shopgate/pwa/pull/497) Fixed metadata addition to addProductsToCart payload ([@fkloes](https://github.com/fkloes))
* [#496](https://github.com/shopgate/pwa/pull/496) Added fallback for renamed getProductPrice selector ([@fkloes](https://github.com/fkloes))
* [#495](https://github.com/shopgate/pwa/pull/495) Added action fallbacks for backwards compatibility to PWA 6.0.0 ([@fkloes](https://github.com/fkloes))
* [#489](https://github.com/shopgate/pwa/pull/489) PWA 1544: Menu selectors doesn't match the reducer name ([@DannyShopgate](https://github.com/DannyShopgate))
* [#488](https://github.com/shopgate/pwa/pull/488) Fixed a bug in the price display that showed the plain value if price was 0. ([@devbucket](https://github.com/devbucket))
* [#474](https://github.com/shopgate/pwa/pull/474) Add new actions to manipulate product meta data and fixed Sheet ([@Carsten89](https://github.com/Carsten89))
* [#483](https://github.com/shopgate/pwa/pull/483) Corrected bug where page configs were fetched on every page … ([@richardgorman](https://github.com/richardgorman))
* [#484](https://github.com/shopgate/pwa/pull/484) Corrected bug where product reviews were not always requested ([@richardgorman](https://github.com/richardgorman))
* [#481](https://github.com/shopgate/pwa/pull/481) Improved layout of "no product results" pages with active filters ([@fkloes](https://github.com/fkloes))
* [#482](https://github.com/shopgate/pwa/pull/482) Updated conductor to v2.0.5 ([@richardgorman](https://github.com/richardgorman))
* [#480](https://github.com/shopgate/pwa/pull/480) Corrected issue where page scrolling was not consistent ([@richardgorman](https://github.com/richardgorman))
* [#477](https://github.com/shopgate/pwa/pull/477) Fixed invalid it-IT translation file ([@fkloes](https://github.com/fkloes))
* [#478](https://github.com/shopgate/pwa/pull/478) Fixed invalid it-IT language file ([@fkloes](https://github.com/fkloes))
* [#476](https://github.com/shopgate/pwa/pull/476) Fix more products load for product list widget ([@alexbridge](https://github.com/alexbridge))
* [#475](https://github.com/shopgate/pwa/pull/475) App shows white page ([@richardgorman](https://github.com/richardgorman))
* [#467](https://github.com/shopgate/pwa/pull/467) Increased hit area of the cart item context menu ([@fkloes](https://github.com/fkloes))
* [#466](https://github.com/shopgate/pwa/pull/466) Fixed faulty getProducts call with productIds and filters ([@fkloes](https://github.com/fkloes))
* [#462](https://github.com/shopgate/pwa/pull/462) Modified HttpRequest class in core ([@DannyShopgate](https://github.com/DannyShopgate))
* [#452](https://github.com/shopgate/pwa/pull/452) Changed .gitignore to only ignore the theme's config folder. ([@devbucket](https://github.com/devbucket))
* [#448](https://github.com/shopgate/pwa/pull/448) Moved the link around the buttons on iOS UserMenu ([@richardgorman](https://github.com/richardgorman))
* [#435](https://github.com/shopgate/pwa/pull/435) Added support to add multiple products to the cart with the addProductsToCartAction ([@fkloes](https://github.com/fkloes))
* [#425](https://github.com/shopgate/pwa/pull/425) Change to getProductsById action that keeps original hash when some requested products are already cached. Make Product widget responsive to settings changes after mounting ([@aaron-martin](https://github.com/aaron-martin))


## [v6.0.1](https://github.com/shopgate/pwa/compare/v6.0.0...v6.0.1) (2019-01-17)

#### :rocket: Enhancement
* [#432](https://github.com/shopgate/pwa/pull/432) Remove unnecessary redirects ([@alexbridge](https://github.com/alexbridge))
* [#455](https://github.com/shopgate/pwa/pull/455) Reset margin on Register link ([@richardgorman](https://github.com/richardgorman))
* [#439](https://github.com/shopgate/pwa/pull/439) rework e2e tests for ios ([@Iv3x](https://github.com/Iv3x))

#### :bug: Bug Fix
* [#472](https://github.com/shopgate/pwa/pull/472) Fixed broken terms legacy link on iOS theme ([@fkloes](https://github.com/fkloes))
* [#471](https://github.com/shopgate/pwa/pull/471) Infinite Container component drops its scroll reference ([@richardgorman](https://github.com/richardgorman))
* [#469](https://github.com/shopgate/pwa/pull/469) Corrected issue where login inputs are reset when blurred ([@richardgorman](https://github.com/richardgorman))
* [#463](https://github.com/shopgate/pwa/pull/463) Increased hit area of the cart item context menu ([@fkloes](https://github.com/fkloes))
* [#465](https://github.com/shopgate/pwa/pull/465) Fixed opening of child products on favourite list ([@fkloes](https://github.com/fkloes))
* [#464](https://github.com/shopgate/pwa/pull/464) Fixed an issue with product variant selection ([@fkloes](https://github.com/fkloes))
* [#460](https://github.com/shopgate/pwa/pull/460) Fixed product images fallback for variants without own images ([@fkloes](https://github.com/fkloes))
* [#430](https://github.com/shopgate/pwa/pull/430) Added a click handler to the AppBar.Title component ([@richardgorman](https://github.com/richardgorman))
* [#437](https://github.com/shopgate/pwa/pull/437) GMD Snackbar adjusts action color to white when accent color to black contrast is less than 4 ([@sznowicki](https://github.com/sznowicki))
* [#451](https://github.com/shopgate/pwa/pull/451) Added missing react keys in iOS11 theme. ([@devbucket](https://github.com/devbucket))
* [#454](https://github.com/shopgate/pwa/pull/454) Detector fix ([@sznowicki](https://github.com/sznowicki))
* [#453](https://github.com/shopgate/pwa/pull/453) Changed .gitignore to only ignore the theme's config folder. ([@devbucket](https://github.com/devbucket))
* [#442](https://github.com/shopgate/pwa/pull/442) Disabled text selection for product descriptions ([@richardgorman](https://github.com/richardgorman))
* [#449](https://github.com/shopgate/pwa/pull/449) Added variant info to Favorites items ([@richardgorman](https://github.com/richardgorman))
* [#447](https://github.com/shopgate/pwa/pull/447) Moved the button inside of the link inside iOS UserMenu ([@richardgorman](https://github.com/richardgorman))
* [#446](https://github.com/shopgate/pwa/pull/446) Added an explicit zIndex for progress bar in GMD ([@richardgorman](https://github.com/richardgorman))
* [#445](https://github.com/shopgate/pwa/pull/445) Adjusted Variant availability text to ignore touches ([@richardgorman](https://github.com/richardgorman))
* [#443](https://github.com/shopgate/pwa/pull/443) Added missing react keys to to prevent errors with Fragment collections. ([@devbucket](https://github.com/devbucket))
* [#438](https://github.com/shopgate/pwa/pull/438) Safe color contrast for toast action button ([@sznowicki](https://github.com/sznowicki))
* [#434](https://github.com/shopgate/pwa/pull/434) Updated conductor to v1.0.0 to address scroll issue ([@richardgorman](https://github.com/richardgorman))
* [#431](https://github.com/shopgate/pwa/pull/431) Cart information now wraps where appropriate ([@richardgorman](https://github.com/richardgorman))
* [#426](https://github.com/shopgate/pwa/pull/426) Empty filter page after the app was in the background for a while ([@fkloes](https://github.com/fkloes))
* [#429](https://github.com/shopgate/pwa/pull/429) Changed the ViewContent to receive the visible flag as a prop ([@richardgorman](https://github.com/richardgorman))


## [v6.0.0](https://github.com/shopgate/pwa/tree/v6.0.0) (2018-12-04)

#### :rocket: Enhancement
* [#421](https://github.com/shopgate/pwa/pull/421) Add webcheckout register redirect action ([@alexbridge](https://github.com/alexbridge))
* [#422](https://github.com/shopgate/pwa/pull/422) Toast messages are hidden ([@richardgorman](https://github.com/richardgorman))
* [#417](https://github.com/shopgate/pwa/pull/417) Normalise SnackBar usage ([@richardgorman](https://github.com/richardgorman))
* [#414](https://github.com/shopgate/pwa/pull/414) Correct add to cart bar styles ([@richardgorman](https://github.com/richardgorman))
* [#416](https://github.com/shopgate/pwa/pull/416) GMD PaymentBar now renders outside of the route content ([@richardgorman](https://github.com/richardgorman))
* [#419](https://github.com/shopgate/pwa/pull/419) Improved interaction with cart items and the coupon field ([@fkloes](https://github.com/fkloes))
* [#415](https://github.com/shopgate/pwa/pull/415) Copied Viewport blocks to GMD ([@richardgorman](https://github.com/richardgorman))
* [#413](https://github.com/shopgate/pwa/pull/413) Moved PaymentBar and SnackBar in iOS to AppFooter ([@richardgorman](https://github.com/richardgorman))
* [#406](https://github.com/shopgate/pwa/pull/406) Changed pipeline usage to match specification ([@SG-Noxoreos](https://github.com/SG-Noxoreos))
* [#392](https://github.com/shopgate/pwa/pull/392) Refactored toggling of the progress bar within the app bars ([@fkloes](https://github.com/fkloes))
* [#380](https://github.com/shopgate/pwa/pull/380) Added exports to common library for public router imports ([@richardgorman](https://github.com/richardgorman))
* [#343](https://github.com/shopgate/pwa/pull/343) iOS More Route ([@richardgorman](https://github.com/richardgorman))
* [#362](https://github.com/shopgate/pwa/pull/362) CartButton style adjustments ([@richardgorman](https://github.com/richardgorman))
* [#349](https://github.com/shopgate/pwa/pull/349) Improved search suggestions on iOS and GMD theme ([@fkloes](https://github.com/fkloes))
* [#340](https://github.com/shopgate/pwa/pull/340) Remove continue shopping button in iOS ([@richardgorman](https://github.com/richardgorman))
* [#347](https://github.com/shopgate/pwa/pull/347) Added back browse page to ios theme ([@reneeichhorn](https://github.com/reneeichhorn))
* [#344](https://github.com/shopgate/pwa/pull/344) Add cart button to AppBar in iOS theme ([@richardgorman](https://github.com/richardgorman))
* [#341](https://github.com/shopgate/pwa/pull/341) Removed NavDrawer in iOS ([@richardgorman](https://github.com/richardgorman))
* [#329](https://github.com/shopgate/pwa/pull/329) Adjusted font, notification, navigator and buttons to match iOS style. ([@devbucket](https://github.com/devbucket))
* [#336](https://github.com/shopgate/pwa/pull/336) Applied iOS styling to products cards and product grid items of the iOS theme. ([@fkloes](https://github.com/fkloes))
* [#325](https://github.com/shopgate/pwa/pull/325) Added iOS style AddToCart bar. ([@devbucket](https://github.com/devbucket))
* [#323](https://github.com/shopgate/pwa/pull/323) Removed the CartButton from the default AppBar in the iOS theme. ([@devbucket](https://github.com/devbucket))
* [#322](https://github.com/shopgate/pwa/pull/322) Added BackBar to all iOS pages expect for the Startpage and the Login. ([@devbucket](https://github.com/devbucket))
* [#285](https://github.com/shopgate/pwa/pull/285) Added a library for benchmarking and added a public api for it. (new router) ([@reneeichhorn](https://github.com/reneeichhorn))
* [#266](https://github.com/shopgate/pwa/pull/266) PWA-508 optimise cart route ([@richardgorman](https://github.com/richardgorman))
* [#265](https://github.com/shopgate/pwa/pull/265) PWA-444 optomize category and search ([@devbucket](https://github.com/devbucket))
* [#264](https://github.com/shopgate/pwa/pull/264) PWA-911 migrate user privacy extension ([@richardgorman](https://github.com/richardgorman))
* [#262](https://github.com/shopgate/pwa/pull/262) PWA-511 optimise navigator ([@richardgorman](https://github.com/richardgorman))
* [#259](https://github.com/shopgate/pwa/pull/259) PWA-957 optimize tax disclaimer ([@devbucket](https://github.com/devbucket))
* [#255](https://github.com/shopgate/pwa/pull/255) PWA-953 Optimize characteristics ([@devbucket](https://github.com/devbucket))
* [#256](https://github.com/shopgate/pwa/pull/256) PWA-831 refactor filters ([@richardgorman](https://github.com/richardgorman))
* [#249](https://github.com/shopgate/pwa/pull/249) PWA-918 enable product fetching ([@devbucket](https://github.com/devbucket))
* [#254](https://github.com/shopgate/pwa/pull/254) PWA-951 Optimized Portal components as much as possible. ([@devbucket](https://github.com/devbucket))
* [#248](https://github.com/shopgate/pwa/pull/248) PWA-945 Updated conductor ([@richardgorman](https://github.com/richardgorman))
* [#246](https://github.com/shopgate/pwa/pull/246) Pwa 922 refactor filter chips ([@richardgorman](https://github.com/richardgorman))
* [#241](https://github.com/shopgate/pwa/pull/241) PWA-910 render ui with available filters ([@devbucket](https://github.com/devbucket))
* [#240](https://github.com/shopgate/pwa/pull/240) PWA-906 add transitions and the chevron ([@devbucket](https://github.com/devbucket))
* [#237](https://github.com/shopgate/pwa/pull/237) PWA-856 Added GMD styled accordion. ([@devbucket](https://github.com/devbucket))
* [#235](https://github.com/shopgate/pwa/pull/235) Pwa 858 refactor filters feature ([@richardgorman](https://github.com/richardgorman))
* [#233](https://github.com/shopgate/pwa/pull/233) PWA-855 UI-Shared now has an Accordion compound component ([@richardgorman](https://github.com/richardgorman))
* [#223](https://github.com/shopgate/pwa/pull/223) PWA-830 fix timings ([@devbucket](https://github.com/devbucket))
* [#224](https://github.com/shopgate/pwa/pull/224) PWA-860: Revised product selectors and their usages ([@fkloes](https://github.com/fkloes))
* [#215](https://github.com/shopgate/pwa/pull/215) PWA-822 fix linting issues ([@devbucket](https://github.com/devbucket))
* [#181](https://github.com/shopgate/pwa/pull/181) PWA-725 remove unused code from pwa common ([@devbucket](https://github.com/devbucket))
* [#177](https://github.com/shopgate/pwa/pull/177) PWA-724 Optimized code and contents. ([@devbucket](https://github.com/devbucket))
* [#159](https://github.com/shopgate/pwa/pull/159) PWA-629 is working with new router ([@devbucket](https://github.com/devbucket))
* [#149](https://github.com/shopgate/pwa/pull/149) PWA-661 re enable the product sorting ([@devbucket](https://github.com/devbucket))
* [#160](https://github.com/shopgate/pwa/pull/160) PWA-671 add support for shop links ([@richardgorman](https://github.com/richardgorman))
* [#148](https://github.com/shopgate/pwa/pull/148) PWA-626 empty components ([@devbucket](https://github.com/devbucket))
* [#152](https://github.com/shopgate/pwa/pull/152) PWA-624 Handle history reset. ([@devbucket](https://github.com/devbucket))
* [#127](https://github.com/shopgate/pwa/pull/127) PWA-417 implement filters ([@devbucket](https://github.com/devbucket))
* [#142](https://github.com/shopgate/pwa/pull/142) PWA-634 implement redux localstorage ([@devbucket](https://github.com/devbucket))
* [#120](https://github.com/shopgate/pwa/pull/120) PWA-414 reimplement push notifications ([@devbucket](https://github.com/devbucket))
* [#122](https://github.com/shopgate/pwa/pull/122) PWA-420 implement add reviews page ([@richardgorman](https://github.com/richardgorman))
* [#121](https://github.com/shopgate/pwa/pull/121) PWA-561 Fixed getProductsResult bug. ([@devbucket](https://github.com/devbucket))
* [#111](https://github.com/shopgate/pwa/pull/111) PWA-421 gmd implement new router for favorites page ([@devbucket](https://github.com/devbucket))
* [#103](https://github.com/shopgate/pwa/pull/103) PWA-526 pdp add minor optimizations ([@devbucket](https://github.com/devbucket))
* [#108](https://github.com/shopgate/pwa/pull/108) PWA-419 gmd implement new router for reviews page ([@devbucket](https://github.com/devbucket))
* [#101](https://github.com/shopgate/pwa/pull/101) PWA-507 pdp implement gallery ([@devbucket](https://github.com/devbucket))
* [#97](https://github.com/shopgate/pwa/pull/97) PWA-472 implement product reviews ([@richardgorman](https://github.com/richardgorman))
* [#99](https://github.com/shopgate/pwa/pull/99) PWA-468 pdp implement the options ([@devbucket](https://github.com/devbucket))
* [#84](https://github.com/shopgate/pwa/pull/84) PWA-465 pdp implement the image slider ([@devbucket](https://github.com/devbucket))
* [#92](https://github.com/shopgate/pwa/pull/92) PWA-517 Implemented product prices. ([@devbucket](https://github.com/devbucket))
* [#89](https://github.com/shopgate/pwa/pull/89) PWA-466 pdp implement the description ([@devbucket](https://github.com/devbucket))
* [#88](https://github.com/shopgate/pwa/pull/88) PWA-466 implement product header ([@richardgorman](https://github.com/richardgorman))
* [#83](https://github.com/shopgate/pwa/pull/83) PWA-464 pdp implement the basic route ([@devbucket](https://github.com/devbucket))
* [#74](https://github.com/shopgate/pwa/pull/74) PWA-433 implement category products ([@devbucket](https://github.com/devbucket))
* [#70](https://github.com/shopgate/pwa/pull/70) PWA-432 Implement category route ([@devbucket](https://github.com/devbucket))
* [#66](https://github.com/shopgate/pwa/pull/66) PWA-222 Re-created ParsedLink helper mechanisms ([@devbucket](https://github.com/devbucket))
* [#62](https://github.com/shopgate/pwa/pull/62) PWA-241 Moved to Conductor. Deleted unused Router files ([@richardgorman](https://github.com/richardgorman))

#### :bug: Bug Fix
* [#428](https://github.com/shopgate/pwa/pull/428) Removed the Accordion height transition ([@richardgorman](https://github.com/richardgorman))
* [#427](https://github.com/shopgate/pwa/pull/427) Fixed structure of defaultClientInformation ([@fkloes](https://github.com/fkloes))
* [#398](https://github.com/shopgate/pwa/pull/398) Fixed wrong displayed tier price products ([@fkloes](https://github.com/fkloes))
* [#423](https://github.com/shopgate/pwa/pull/423) Increased AppBar z-index to avoid overlapping elements ([@fkloes](https://github.com/fkloes))
* [#422](https://github.com/shopgate/pwa/pull/422) Toast messages are hidden ([@richardgorman](https://github.com/richardgorman))
* [#417](https://github.com/shopgate/pwa/pull/417) Normalise SnackBar usage ([@richardgorman](https://github.com/richardgorman))
* [#414](https://github.com/shopgate/pwa/pull/414) Correct add to cart bar styles ([@richardgorman](https://github.com/richardgorman))
* [#416](https://github.com/shopgate/pwa/pull/416) GMD PaymentBar now renders outside of the route content ([@richardgorman](https://github.com/richardgorman))
* [#419](https://github.com/shopgate/pwa/pull/419) Improved interaction with cart items and the coupon field ([@fkloes](https://github.com/fkloes))
* [#418](https://github.com/shopgate/pwa/pull/418) Updated Conductor package ([@richardgorman](https://github.com/richardgorman))
* [#415](https://github.com/shopgate/pwa/pull/415) Copied Viewport blocks to GMD ([@richardgorman](https://github.com/richardgorman))
* [#413](https://github.com/shopgate/pwa/pull/413) Moved PaymentBar and SnackBar in iOS to AppFooter ([@richardgorman](https://github.com/richardgorman))
* [#405](https://github.com/shopgate/pwa/pull/405) Refactored SnackBar to use react-spring ([@richardgorman](https://github.com/richardgorman))
* [#407](https://github.com/shopgate/pwa/pull/407) Fixed broken InfiniteContainer process ([@fkloes](https://github.com/fkloes))
* [#410](https://github.com/shopgate/pwa/pull/410) Fixed a cached selector that caused outdated url in tracking data ([@reneeichhorn](https://github.com/reneeichhorn))
* [#411](https://github.com/shopgate/pwa/pull/411) Page content is now below all AppBars ([@richardgorman](https://github.com/richardgorman))
* [#409](https://github.com/shopgate/pwa/pull/409) Cart items are not visible when entering the cart ([@richardgorman](https://github.com/richardgorman))
* [#408](https://github.com/shopgate/pwa/pull/408) Re-added hiding of the legacy menu bar on app start ([@fkloes](https://github.com/fkloes))
* [#403](https://github.com/shopgate/pwa/pull/403) More menu buttons on iOS will now wrap on small devices ([@richardgorman](https://github.com/richardgorman))
* [#399](https://github.com/shopgate/pwa/pull/399) Improved button appearance on small iOS devices ([@fkloes](https://github.com/fkloes))
* [#401](https://github.com/shopgate/pwa/pull/401) Updated conductor to 1.0.0-beta.45 ([@richardgorman](https://github.com/richardgorman))
* [#392](https://github.com/shopgate/pwa/pull/392) Refactored toggling of the progress bar within the app bars ([@fkloes](https://github.com/fkloes))
* [#396](https://github.com/shopgate/pwa/pull/396) Image widget now hides when set to unpublished ([@richardgorman](https://github.com/richardgorman))
* [#395](https://github.com/shopgate/pwa/pull/395) Fixed a bug that caused broken product pages ([@fkloes](https://github.com/fkloes))
* [#388](https://github.com/shopgate/pwa/pull/388) Added flushTab option for legacy links within the handleLinks helper ([@fkloes](https://github.com/fkloes))
* [#391](https://github.com/shopgate/pwa/pull/391) Tapping on blank area now closes Search ([@richardgorman](https://github.com/richardgorman))
* [#385](https://github.com/shopgate/pwa/pull/385) Reverted styling changes to SnackBar ([@richardgorman](https://github.com/richardgorman))
* [#384](https://github.com/shopgate/pwa/pull/384) Corrected an issue where the action of stacked toast messages was incorrect ([@richardgorman](https://github.com/richardgorman))
* [#377](https://github.com/shopgate/pwa/pull/377) Removed unnecessary white space below routes ([@richardgorman](https://github.com/richardgorman))
* [#382](https://github.com/shopgate/pwa/pull/382) Corrected a bug that prevented filter attributes from being selected ([@richardgorman](https://github.com/richardgorman))
* [#383](https://github.com/shopgate/pwa/pull/383) Characteristic button text is now aligned on iOS ([@richardgorman](https://github.com/richardgorman))
* [#372](https://github.com/shopgate/pwa/pull/372) Fixed an inAppBrowser issue where previous opened pages got visible again ([@fkloes](https://github.com/fkloes))
* [#378](https://github.com/shopgate/pwa/pull/378) Corrected a bug where child product prices were not updating ([@richardgorman](https://github.com/richardgorman))
* [#379](https://github.com/shopgate/pwa/pull/379) Added the guest registration link to the legacy link list ([@fkloes](https://github.com/fkloes))
* [#375](https://github.com/shopgate/pwa/pull/375) Correct bug where products could not be sorted due to wrong navigation location ([@richardgorman](https://github.com/richardgorman))
* [#376](https://github.com/shopgate/pwa/pull/376) Corrected a bug where setting a filter slider to its original value was considered a change. ([@richardgorman](https://github.com/richardgorman))
* [#374](https://github.com/shopgate/pwa/pull/374) Forced the search input field to reset ([@richardgorman](https://github.com/richardgorman))
* [#373](https://github.com/shopgate/pwa/pull/373) Corrected a bug where the MessageBar would shrink inside a f… ([@richardgorman](https://github.com/richardgorman))
* [#367](https://github.com/shopgate/pwa/pull/367) Fixed product list updates when filters where applied or changed ([@fkloes](https://github.com/fkloes))
* [#365](https://github.com/shopgate/pwa/pull/365) Corrected issue with native modals and images on iOS ([@richardgorman](https://github.com/richardgorman))
* [#364](https://github.com/shopgate/pwa/pull/364) Corrected a visual bug caused by Safari 10.3 bug ([@richardgorman](https://github.com/richardgorman))
* [#353](https://github.com/shopgate/pwa/pull/353) Fixed an issue where the page content was overlapped by footer components ([@fkloes](https://github.com/fkloes))
* [#348](https://github.com/shopgate/pwa/pull/348) Added AppBar to product gallery to be able to go back ([@reneeichhorn](https://github.com/reneeichhorn))
* [#358](https://github.com/shopgate/pwa/pull/358) iOS widget headline styling is now consistent ([@richardgorman](https://github.com/richardgorman))
* [#360](https://github.com/shopgate/pwa/pull/360) AppBar is now rendered outside of the scrollable content ([@richardgorman](https://github.com/richardgorman))
* [#354](https://github.com/shopgate/pwa/pull/354) Removed inline scroll polyfill in favour of the npm package ([@richardgorman](https://github.com/richardgorman))
* [#361](https://github.com/shopgate/pwa/pull/361) Corrected visual bugs inside GMD ([@richardgorman](https://github.com/richardgorman))
* [#357](https://github.com/shopgate/pwa/pull/357) AddToCartBar is now rendered outside of the page content ([@richardgorman](https://github.com/richardgorman))
* [#349](https://github.com/shopgate/pwa/pull/349) Improved search suggestions on iOS and GMD theme ([@fkloes](https://github.com/fkloes))
* [#346](https://github.com/shopgate/pwa/pull/346) Changed Viewport to split TabBar and content into 2 sections ([@richardgorman](https://github.com/richardgorman))
* [#321](https://github.com/shopgate/pwa/pull/321) The store is not re-hydrated after the initial state was already set. ([@devbucket](https://github.com/devbucket))
* [#318](https://github.com/shopgate/pwa/pull/318) Filters are now taken from the action when requesting ([@richardgorman](https://github.com/richardgorman))
* [#320](https://github.com/shopgate/pwa/pull/320) Products are now requested with the exact price range from the filters ([@fkloes](https://github.com/fkloes))
* [#316](https://github.com/shopgate/pwa/pull/316) Client Information now displays correctly inside NavDrawer ([@richardgorman](https://github.com/richardgorman))
* [#314](https://github.com/shopgate/pwa/pull/314) Review props are not causing unnecessary updates in the component. ([@devbucket](https://github.com/devbucket))
* [#307](https://github.com/shopgate/pwa/pull/307) User is shown a white page when navigating ([@richardgorman](https://github.com/richardgorman))
* [#312](https://github.com/shopgate/pwa/pull/312) The checkout bar is only disabled once when the cart is busy. ([@devbucket](https://github.com/devbucket))
* [#311](https://github.com/shopgate/pwa/pull/311) Sorting does not request products ([@richardgorman](https://github.com/richardgorman))
* [#308](https://github.com/shopgate/pwa/pull/308) Overlapping selected filters are cut off by an ellipsis on the filter page. ([@devbucket](https://github.com/devbucket))
* [#306](https://github.com/shopgate/pwa/pull/306) Fixed handling of deeplinks and push messages ([@fkloes](https://github.com/fkloes))
* [#303](https://github.com/shopgate/pwa/pull/303) Fixed filter attribute deselection from within the filters page ([@fkloes](https://github.com/fkloes))
* [#271](https://github.com/shopgate/pwa/pull/271) PWA-764: Migrate pages tracking ([@fkloes](https://github.com/fkloes))
* [#258](https://github.com/shopgate/pwa/pull/258) PWA-970 Added new category selectors. Converted list component to be … ([@richardgorman](https://github.com/richardgorman))
* [#253](https://github.com/shopgate/pwa/pull/253) PWA-959 remove redux props ([@devbucket](https://github.com/devbucket))
* [#244](https://github.com/shopgate/pwa/pull/244) PWA-875: Implement dynamic redirects ([@fkloes](https://github.com/fkloes))
* [#230](https://github.com/shopgate/pwa/pull/230) PWA-813: Improved product related selectors ([@fkloes](https://github.com/fkloes))
* [#207](https://github.com/shopgate/pwa/pull/207) PWA-683 fix favorites route ([@richardgorman](https://github.com/richardgorman))


## [Changelog for versions before v6.0.0](https://github.com/shopgate/pwa/blob/v5.X/CHANGELOG.md)


## [Changelog for versions before v5.0.0](https://github.com/shopgate/theme-gmd/blob/v4.3.0/CHANGELOG.md)
