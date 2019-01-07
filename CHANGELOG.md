# Changelog

## [v5.10.3](https://github.com/shopgate/pwa/tree/v5.10.3) (2019-01-07)
:rocket: **Enhancements:**

- Fixed invalid it-IT language file [\#478](https://github.com/shopgate/pwa/pull/478) ([fkloes](https://github.com/fkloes))
- Modified HttpRequest class in core [\#462](https://github.com/shopgate/pwa/pull/462) ([DannyShopgate](https://github.com/DannyShopgate))
- Update Spanish translations [\#459](https://github.com/shopgate/pwa/pull/459) ([Bettina-Baumert](https://github.com/Bettina-Baumert))
- Reset margin of Register links [\#456](https://github.com/shopgate/pwa/pull/456) ([richardgorman](https://github.com/richardgorman))
- Removed text selection for product descriptions [\#444](https://github.com/shopgate/pwa/pull/444) ([richardgorman](https://github.com/richardgorman))

:bug: **Fixed bugs:**

- Fixed invalid it-IT language file [\#478](https://github.com/shopgate/pwa/pull/478) ([fkloes](https://github.com/fkloes))
- Fix more products load for product list widget [\#476](https://github.com/shopgate/pwa/pull/476) ([alexbridge](https://github.com/alexbridge))
- Increased hit area of the cart item context menu [\#467](https://github.com/shopgate/pwa/pull/467) ([fkloes](https://github.com/fkloes))
- Fixed faulty getProducts call with productIds and filters [\#466](https://github.com/shopgate/pwa/pull/466) ([fkloes](https://github.com/fkloes))
- Modified HttpRequest class in core [\#462](https://github.com/shopgate/pwa/pull/462) ([DannyShopgate](https://github.com/DannyShopgate))
- Changed .gitignore to only ignore the theme's config folder. [\#452](https://github.com/shopgate/pwa/pull/452) ([devbucket](https://github.com/devbucket))
- Moved the link around the buttons on iOS UserMenu [\#448](https://github.com/shopgate/pwa/pull/448) ([richardgorman](https://github.com/richardgorman))
- Change to getProductsById action that keeps original hash when some requested products are already cached. Make Product widget responsive to settings changes after mounting [\#425](https://github.com/shopgate/pwa/pull/425) ([aaron-martin](https://github.com/aaron-martin))

## [v6.0.0](https://github.com/shopgate/pwa/tree/v6.0.0) (2018-12-04)
:bug: **Fixed bugs:**

- GMD Snackbar adjusts action color to white when accent color to black contrast is less than 4 [\#437](https://github.com/shopgate/pwa/pull/437) ([sznowicki](https://github.com/sznowicki))

:nail_care: **Others:**

- Fixed structure of defaultClientInformation [\#420](https://github.com/shopgate/pwa/pull/420) ([Carsten89](https://github.com/Carsten89))

## [v5.10.2](https://github.com/shopgate/pwa/tree/v5.10.2) (2018-11-23)
## [v5.9.1](https://github.com/shopgate/pwa/tree/v5.9.1) (2018-11-23)
:rocket: **Enhancements:**

- Added portals and location prop for product-item.price [\#381](https://github.com/shopgate/pwa/pull/381) ([DannyShopgate](https://github.com/DannyShopgate))

:bug: **Fixed bugs:**

- Improve concurrent cart actions, when adding a coupon from deeplink [\#404](https://github.com/shopgate/pwa/pull/404) ([alexbridge](https://github.com/alexbridge))

:nail_care: **Others:**

- Added new portals and exported selectors [\#400](https://github.com/shopgate/pwa/pull/400) ([Carsten89](https://github.com/Carsten89))

## [v5.10.1](https://github.com/shopgate/pwa/tree/v5.10.1) (2018-11-16)
:bug: **Fixed bugs:**

- Replaced deprecated FR, LV, FE and GE iso province codes [\#393](https://github.com/shopgate/pwa/pull/393) ([SG-Noxoreos](https://github.com/SG-Noxoreos))
- Added flushTab option for legacy links within the parsed-link helper [\#387](https://github.com/shopgate/pwa/pull/387) ([fkloes](https://github.com/fkloes))

:nail_care: **Others:**

- Fix eslint errors in the form builder [\#394](https://github.com/shopgate/pwa/pull/394) ([alexbridge](https://github.com/alexbridge))
- Extend timeout for test stability [\#390](https://github.com/shopgate/pwa/pull/390) ([Iv3x](https://github.com/Iv3x))
- Added spec files for e2e execution [\#389](https://github.com/shopgate/pwa/pull/389) ([Iv3x](https://github.com/Iv3x))

## [v5.10.0](https://github.com/shopgate/pwa/tree/v5.10.0) (2018-11-12)
:bug: **Fixed bugs:**

- Correct price formatting on product detail page when price is 0 [\#371](https://github.com/shopgate/pwa/pull/371) ([aaron-martin](https://github.com/aaron-martin))
- Fixed an inAppBrowser issue where previous opened pages got visible again [\#370](https://github.com/shopgate/pwa/pull/370) ([fkloes](https://github.com/fkloes))
- Corrected a bug where the filters labels can run out of the viewport [\#368](https://github.com/shopgate/pwa/pull/368) ([richardgorman](https://github.com/richardgorman))
- Updated `react-hot-loader` to prevent issues with newer `react` version. [\#363](https://github.com/shopgate/pwa/pull/363) ([devbucket](https://github.com/devbucket))

:nail_care: **Others:**

- My account menu header portal [\#359](https://github.com/shopgate/pwa/pull/359) ([alexbridge](https://github.com/alexbridge))
- Added possibility to open legacy `user\_lost\_password` link [\#355](https://github.com/shopgate/pwa/pull/355) ([philipp-heyse](https://github.com/philipp-heyse))
- Added automatic changelog generation and handling for stable releases. [\#350](https://github.com/shopgate/pwa/pull/350) ([SG-Noxoreos](https://github.com/SG-Noxoreos))
- fix linting errors for e2e test suite [\#334](https://github.com/shopgate/pwa/pull/334) ([Iv3x](https://github.com/Iv3x))

## [v5.9.0](https://github.com/shopgate/pwa/tree/v5.9.0) (2018-10-30)
:rocket: **Enhancements:**

- Makefile improvements [\#342](https://github.com/shopgate/pwa/pull/342) ([SG-Noxoreos](https://github.com/SG-Noxoreos))
- Introduced automatic creation of github releases [\#338](https://github.com/shopgate/pwa/pull/338) ([SG-Noxoreos](https://github.com/SG-Noxoreos))
- Implemented iOS and Android Share icons and Native Share App Command [\#332](https://github.com/shopgate/pwa/pull/332) ([DannyShopgate](https://github.com/DannyShopgate))
- The browser connector is used only in none SDK web environments. [\#331](https://github.com/shopgate/pwa/pull/331) ([devbucket](https://github.com/devbucket))
- Added an action that allows to disable/enable the login form [\#330](https://github.com/shopgate/pwa/pull/330) ([reneeichhorn](https://github.com/reneeichhorn))
- Sheet accepts className prop. [\#327](https://github.com/shopgate/pwa/pull/327) ([sznowicki](https://github.com/sznowicki))
- A getProductRelations pipeline redux implementation [\#310](https://github.com/shopgate/pwa/pull/310) ([sznowicki](https://github.com/sznowicki))
- Implemented the EmbeddedMedia collection to improve handling of playing media on navigation [\#291](https://github.com/shopgate/pwa/pull/291) ([fkloes](https://github.com/fkloes))
- Added a library for benchmarking and added a public api for it. [\#284](https://github.com/shopgate/pwa/pull/284) ([reneeichhorn](https://github.com/reneeichhorn))
- Portals: Sending original component down to the portal instance. [\#279](https://github.com/shopgate/pwa/pull/279) ([Carsten89](https://github.com/Carsten89))
- Added Pull Request Template and automatic changelog creation. [\#278](https://github.com/shopgate/pwa/pull/278) ([devbucket](https://github.com/devbucket))
- Implemented BrowserConnector to be able to call Pipelines fro a non App environment \(browser\) [\#32](https://github.com/shopgate/pwa/pull/32) ([devbucket](https://github.com/devbucket))

:bug: **Fixed bugs:**

- CartButton and SearchButton are now reliably hidden on cart page [\#333](https://github.com/shopgate/pwa/pull/333) ([fkloes](https://github.com/fkloes))
- Added default limit for getProductsRelations action [\#328](https://github.com/shopgate/pwa/pull/328) ([sznowicki](https://github.com/sznowicki))
- Fixed a broken import [\#319](https://github.com/shopgate/pwa/pull/319) ([sznowicki](https://github.com/sznowicki))
- Fix product price in favorites to match product actual price [\#315](https://github.com/shopgate/pwa/pull/315) ([alexbridge](https://github.com/alexbridge))
- Moved from @shopgate/react-hammerjs to react-hammerjs from npm. [\#313](https://github.com/shopgate/pwa/pull/313) ([devbucket](https://github.com/devbucket))
- Fixed hammer.js by fixing the version to 0.5.6 [\#302](https://github.com/shopgate/pwa/pull/302) ([devbucket](https://github.com/devbucket))
- Fix UI separating line between coupon and coupon field. [\#295](https://github.com/shopgate/pwa/pull/295) ([alexbridge](https://github.com/alexbridge))
- Removed country codes from province province codes used by the form builder [\#293](https://github.com/shopgate/pwa/pull/293) ([SG-Noxoreos](https://github.com/SG-Noxoreos))
- Moved out the benchmarking tool out from devDependencies to the dependency list [\#289](https://github.com/shopgate/pwa/pull/289) ([SG-Noxoreos](https://github.com/SG-Noxoreos))
- A rebuildOnUpdate prop implemented to a Slider. [\#288](https://github.com/shopgate/pwa/pull/288) ([sznowicki](https://github.com/sznowicki))
- Added iPhoneXs, XsMax and Xr support [\#287](https://github.com/shopgate/pwa/pull/287) ([Carsten89](https://github.com/Carsten89))

:nail_care: **Others:**

- E2E tests for user Address Book [\#326](https://github.com/shopgate/pwa/pull/326) ([alexbridge](https://github.com/alexbridge))
- Changed Makefile to support subtrees and prepare it for additional automation [\#317](https://github.com/shopgate/pwa/pull/317) ([SG-Noxoreos](https://github.com/SG-Noxoreos))
- fixed a typo in a translation [\#305](https://github.com/shopgate/pwa/pull/305) ([chrisEff](https://github.com/chrisEff))
- fixed a typo in a translation [\#304](https://github.com/shopgate/pwa/pull/304) ([chrisEff](https://github.com/chrisEff))
- clientInformation is taken from window.navigator instead of webStorage [\#300](https://github.com/shopgate/pwa/pull/300) ([devbucket](https://github.com/devbucket))
- Changed test IDs and tests to not depend on exact same data and be able to run with similar data. [\#298](https://github.com/shopgate/pwa/pull/298) ([Iv3x](https://github.com/Iv3x))
- Move from Git submodules to Git subtree [\#294](https://github.com/shopgate/pwa/pull/294) ([devbucket](https://github.com/devbucket))
- Added selectors for product properties and cartItemById [\#290](https://github.com/shopgate/pwa/pull/290) ([Carsten89](https://github.com/Carsten89))
- TD-864-optimize-portal [\#281](https://github.com/shopgate/pwa/pull/281) ([Carsten89](https://github.com/Carsten89))
- Pwa 887 [\#277](https://github.com/shopgate/pwa/pull/277) ([reneeichhorn](https://github.com/reneeichhorn))
- PWA-706-fix-portal-usage [\#272](https://github.com/shopgate/pwa/pull/272) ([SG-Noxoreos](https://github.com/SG-Noxoreos))
- Pwa 706 address management [\#269](https://github.com/shopgate/pwa/pull/269) ([SG-Noxoreos](https://github.com/SG-Noxoreos))

## [v5.8.0](https://github.com/shopgate/pwa/tree/v5.8.0) (2018-09-18)
:rocket: **Enhancements:**

- PWA-885 create deployment test [\#243](https://github.com/shopgate/pwa/pull/243) ([Iv3x](https://github.com/Iv3x))

## [v5.7.4](https://github.com/shopgate/pwa/tree/v5.7.4) (2018-09-07)
:nail_care: **Others:**

- Shopify 529 create a new portal [\#239](https://github.com/shopgate/pwa/pull/239) ([awesselburg](https://github.com/awesselburg))
- CCP-812 added portals for prices in favlist [\#238](https://github.com/shopgate/pwa/pull/238) ([Carsten89](https://github.com/Carsten89))
- PWA-746: Fixed an issue with user review updates [\#234](https://github.com/shopgate/pwa/pull/234) ([fkloes](https://github.com/fkloes))
- PWA-829: added second condition to determin if slider.fixLoop should … [\#226](https://github.com/shopgate/pwa/pull/226) ([Shopgate-Travis](https://github.com/Shopgate-Travis))

## [v5.7.3](https://github.com/shopgate/pwa/tree/v5.7.3) (2018-08-26)
## [v5.7.2](https://github.com/shopgate/pwa/tree/v5.7.2) (2018-08-25)
## [v5.7.1](https://github.com/shopgate/pwa/tree/v5.7.1) (2018-08-25)
## [v5.7.0](https://github.com/shopgate/pwa/tree/v5.7.0) (2018-08-24)
:bug: **Fixed bugs:**

- PWA-873 Fixed unit test suite and updated snapshots. [\#225](https://github.com/shopgate/pwa/pull/225) ([devbucket](https://github.com/devbucket))

:nail_care: **Others:**

- CCP-144-dialog-btn-txt-align [\#222](https://github.com/shopgate/pwa/pull/222) ([Carsten89](https://github.com/Carsten89))
- PWA-723 e2e test for native checkout [\#210](https://github.com/shopgate/pwa/pull/210) ([Iv3x](https://github.com/Iv3x))
- Pwa 773 [\#208](https://github.com/shopgate/pwa/pull/208) ([sznowicki](https://github.com/sznowicki))
- PWA-389 Sync mock for pipeline request [\#205](https://github.com/shopgate/pwa/pull/205) ([sofib](https://github.com/sofib))
- PWA-749 updated hashes [\#200](https://github.com/shopgate/pwa/pull/200) ([Iv3x](https://github.com/Iv3x))
- Pwa 73 onload command clean [\#198](https://github.com/shopgate/pwa/pull/198) ([sznowicki](https://github.com/sznowicki))
- Pwa 364 physical pixel size helper [\#192](https://github.com/shopgate/pwa/pull/192) ([sznowicki](https://github.com/sznowicki))

## [v5.6.0](https://github.com/shopgate/pwa/tree/v5.6.0) (2018-08-09)
:nail_care: **Others:**

- PWA-704 fixed issue with cached items [\#206](https://github.com/shopgate/pwa/pull/206) ([Carsten89](https://github.com/Carsten89))
- PWA-747: Extended jest.config [\#195](https://github.com/shopgate/pwa/pull/195) ([fkloes](https://github.com/fkloes))
- PWA-747: Extended jest.config to fix tests [\#191](https://github.com/shopgate/pwa/pull/191) ([fkloes](https://github.com/fkloes))
- Pwa 744 [\#190](https://github.com/shopgate/pwa/pull/190) ([Carsten89](https://github.com/Carsten89))
- PWA-743 - hide loading spinner when totalItems is lower than actually… [\#188](https://github.com/shopgate/pwa/pull/188) ([sznowicki](https://github.com/sznowicki))
- PWA-73 - hide splashscreen after app did start to make all listeners … [\#185](https://github.com/shopgate/pwa/pull/185) ([sznowicki](https://github.com/sznowicki))
- PWA-721 - request available filters on search query change [\#184](https://github.com/shopgate/pwa/pull/184) ([sznowicki](https://github.com/sznowicki))
- V5.7 [\#180](https://github.com/shopgate/pwa/pull/180) ([sznowicki](https://github.com/sznowicki))
- Pwa 718 user review always on top [\#178](https://github.com/shopgate/pwa/pull/178) ([sznowicki](https://github.com/sznowicki))
- PWA-252 - removing the valueLabels in the correct way [\#176](https://github.com/shopgate/pwa/pull/176) ([sznowicki](https://github.com/sznowicki))
- Pwa 487 checkout action timeouts [\#174](https://github.com/shopgate/pwa/pull/174) ([sznowicki](https://github.com/sznowicki))
- PWA-679 Fix pipeline manager issues [\#166](https://github.com/shopgate/pwa/pull/166) ([fkloes](https://github.com/fkloes))
- PWA-690 Rectify ESLint issues for themes [\#163](https://github.com/shopgate/pwa/pull/163) ([alexbridge](https://github.com/alexbridge))
- Pwa 656 backdrop enhancements [\#162](https://github.com/shopgate/pwa/pull/162) ([sznowicki](https://github.com/sznowicki))
- MAGENTO-2044 - add lib version [\#161](https://github.com/shopgate/pwa/pull/161) ([awesselburg](https://github.com/awesselburg))
- PWA-255 [\#156](https://github.com/shopgate/pwa/pull/156) ([Carsten89](https://github.com/Carsten89))
- MAGENTO-2044 - add setCookie App command [\#155](https://github.com/shopgate/pwa/pull/155) ([awesselburg](https://github.com/awesselburg))
- PI-8827 fixed not spinning indicator circle for search [\#153](https://github.com/shopgate/pwa/pull/153) ([Carsten89](https://github.com/Carsten89))
- PWA-675 Prevent duplicate message modals [\#151](https://github.com/shopgate/pwa/pull/151) ([fkloes](https://github.com/fkloes))
- PWA-639 Add Select form element to ui-shared components [\#150](https://github.com/shopgate/pwa/pull/150) ([alexbridge](https://github.com/alexbridge))
- PWA-654 - some app events must be registered before they are used [\#147](https://github.com/shopgate/pwa/pull/147) ([sznowicki](https://github.com/sznowicki))
- PWA-594 updated hashes [\#146](https://github.com/shopgate/pwa/pull/146) ([Iv3x](https://github.com/Iv3x))
- Pwa 475 error handling for categories [\#144](https://github.com/shopgate/pwa/pull/144) ([sznowicki](https://github.com/sznowicki))
- PWA-658 Suppress ENOTFOUND by default [\#143](https://github.com/shopgate/pwa/pull/143) ([alexbridge](https://github.com/alexbridge))
- Pwa 605 sg tracking meta data [\#141](https://github.com/shopgate/pwa/pull/141) ([sznowicki](https://github.com/sznowicki))
- PWA-593 updated hashes [\#140](https://github.com/shopgate/pwa/pull/140) ([Iv3x](https://github.com/Iv3x))
- PWA-592 updated hashes [\#139](https://github.com/shopgate/pwa/pull/139) ([Iv3x](https://github.com/Iv3x))
- Ccp 449 pollin order form [\#137](https://github.com/shopgate/pwa/pull/137) ([Carsten89](https://github.com/Carsten89))
- PWA-503 - z-index fixes for PDP [\#135](https://github.com/shopgate/pwa/pull/135) ([sznowicki](https://github.com/sznowicki))
- PWA-580 - sgapi links must not have trailing slashes [\#133](https://github.com/shopgate/pwa/pull/133) ([sznowicki](https://github.com/sznowicki))
- CCP-684: added support for ctaPrimary and ctaPrimaryContrast to AddTo… [\#132](https://github.com/shopgate/pwa/pull/132) ([aaron-martin](https://github.com/aaron-martin))
- PWA-584 e2e functional cart [\#131](https://github.com/shopgate/pwa/pull/131) ([Iv3x](https://github.com/Iv3x))

## [v5.5.0](https://github.com/shopgate/pwa/tree/v5.5.0) (2018-07-06)
:bug: **Fixed bugs:**

- PWA-373 Add currency to app default config [\#138](https://github.com/shopgate/pwa/pull/138) ([alexbridge](https://github.com/alexbridge))

:nail_care: **Others:**

- PWA-659 fixed image gallery on ios10 [\#145](https://github.com/shopgate/pwa/pull/145) ([Carsten89](https://github.com/Carsten89))
- PWA-604: Pages are tracked anymore when the user enters the checkout [\#136](https://github.com/shopgate/pwa/pull/136) ([fkloes](https://github.com/fkloes))
- PWA-567: ProductSlider items now have equal heights [\#130](https://github.com/shopgate/pwa/pull/130) ([fkloes](https://github.com/fkloes))
- CCP-691 - pause animation of spinner on add to cart [\#128](https://github.com/shopgate/pwa/pull/128) ([sznowicki](https://github.com/sznowicki))
- PWA-581 e2e functional [\#126](https://github.com/shopgate/pwa/pull/126) ([Iv3x](https://github.com/Iv3x))
- CCP-680: Added onSelect callback to the PickerComponent [\#125](https://github.com/shopgate/pwa/pull/125) ([fkloes](https://github.com/fkloes))
- PWA-564 e2e functional [\#124](https://github.com/shopgate/pwa/pull/124) ([Iv3x](https://github.com/Iv3x))
- PWA-552 [\#123](https://github.com/shopgate/pwa/pull/123) ([SG-Noxoreos](https://github.com/SG-Noxoreos))
- PWA-559 pass state and subscribe to tracking plugins [\#118](https://github.com/shopgate/pwa/pull/118) ([Carsten89](https://github.com/Carsten89))
- CCP-670 added custom event [\#117](https://github.com/shopgate/pwa/pull/117) ([Carsten89](https://github.com/Carsten89))
- Ccp 642 release items on favorite list changes [\#116](https://github.com/shopgate/pwa/pull/116) ([aaron-martin](https://github.com/aaron-martin))
- PWA-347 Replace onTouchTap with onClick for Checkbox component [\#114](https://github.com/shopgate/pwa/pull/114) ([alexbridge](https://github.com/alexbridge))
- CCP-656: Improved cartProductPendingCount [\#112](https://github.com/shopgate/pwa/pull/112) ([fkloes](https://github.com/fkloes))
- PWA-502 - support for single selection filters \(constant + shared Rad… [\#110](https://github.com/shopgate/pwa/pull/110) ([sznowicki](https://github.com/sznowicki))
- PWA-484 fix favorites add products to cart to comply with specification [\#107](https://github.com/shopgate/pwa/pull/107) ([SG-Noxoreos](https://github.com/SG-Noxoreos))
- PWA-527 e2e test favorites [\#106](https://github.com/shopgate/pwa/pull/106) ([Iv3x](https://github.com/Iv3x))
- CCP-446 export getProductPropertiesState selector [\#105](https://github.com/shopgate/pwa/pull/105) ([Carsten89](https://github.com/Carsten89))
- PWA-150 Add Radio button checked, unchecked icons [\#104](https://github.com/shopgate/pwa/pull/104) ([alexbridge](https://github.com/alexbridge))
- Pwa 378 parse internal links correctly [\#102](https://github.com/shopgate/pwa/pull/102) ([sznowicki](https://github.com/sznowicki))
- PWA-515 e2e test reviews [\#100](https://github.com/shopgate/pwa/pull/100) ([Iv3x](https://github.com/Iv3x))
- Ccp 637 styles in widgets [\#98](https://github.com/shopgate/pwa/pull/98) ([sznowicki](https://github.com/sznowicki))
- PWA-428 Link has a new property disabled [\#94](https://github.com/shopgate/pwa/pull/94) ([alexbridge](https://github.com/alexbridge))

## [v5.4.1](https://github.com/shopgate/pwa/tree/v5.4.1) (2018-06-11)
## [v5.4.0](https://github.com/shopgate/pwa/tree/v5.4.0) (2018-06-11)
:nail_care: **Others:**

- PWA-177: Track pages when coming back from legacy pages [\#93](https://github.com/shopgate/pwa/pull/93) ([fkloes](https://github.com/fkloes))
- CCP-631 - favorites portals [\#91](https://github.com/shopgate/pwa/pull/91) ([sznowicki](https://github.com/sznowicki))
- PWA-513 e2e test filter [\#87](https://github.com/shopgate/pwa/pull/87) ([Iv3x](https://github.com/Iv3x))
- PWA-510 e2e test login [\#85](https://github.com/shopgate/pwa/pull/85) ([Iv3x](https://github.com/Iv3x))
- PWA-451 e2e test search [\#82](https://github.com/shopgate/pwa/pull/82) ([Iv3x](https://github.com/Iv3x))
- PWA-488: Added new favoritesDidUpdate$ stream [\#80](https://github.com/shopgate/pwa/pull/80) ([fkloes](https://github.com/fkloes))
- Pwa-450 e2e test cart [\#77](https://github.com/shopgate/pwa/pull/77) ([Iv3x](https://github.com/Iv3x))
- CCP-594 - scheduled widgets support [\#76](https://github.com/shopgate/pwa/pull/76) ([sznowicki](https://github.com/sznowicki))
- PWA-437: Favourite list has issues with "out of stock" items [\#72](https://github.com/shopgate/pwa/pull/72) ([CarinaHoffmann](https://github.com/CarinaHoffmann))
- Pwa 438 test coverage [\#71](https://github.com/shopgate/pwa/pull/71) ([Iv3x](https://github.com/Iv3x))
- PWA-334 e2e productpage [\#69](https://github.com/shopgate/pwa/pull/69) ([Iv3x](https://github.com/Iv3x))
- PWA-333 [\#61](https://github.com/shopgate/pwa/pull/61) ([Iv3x](https://github.com/Iv3x))
- CCP-546 - navigator portals [\#58](https://github.com/shopgate/pwa/pull/58) ([sznowicki](https://github.com/sznowicki))
- CCP-454-implement-plotproject-commands [\#36](https://github.com/shopgate/pwa/pull/36) ([Carsten89](https://github.com/Carsten89))

## [v5.3.0](https://github.com/shopgate/pwa/tree/v5.3.0) (2018-05-24)
:rocket: **Enhancements:**

- Parameters of original url are not duplicated, added tests [\#50](https://github.com/shopgate/pwa/pull/50) ([sofib](https://github.com/sofib))
- PWA-299: Refactored / Implemented error handling. [\#41](https://github.com/shopgate/pwa/pull/41) ([devbucket](https://github.com/devbucket))

:bug: **Fixed bugs:**

- PWA-424 Handling process sequencial correctly. [\#63](https://github.com/shopgate/pwa/pull/63) ([devbucket](https://github.com/devbucket))

:nail_care: **Others:**

- PWA-403: Error handling: Pipeline not yield a response [\#60](https://github.com/shopgate/pwa/pull/60) ([CarinaHoffmann](https://github.com/CarinaHoffmann))
- PWA-402 fix is orderable [\#59](https://github.com/shopgate/pwa/pull/59) ([devbucket](https://github.com/devbucket))
- PWA-393 send hide splash screen command. [\#57](https://github.com/shopgate/pwa/pull/57) ([devbucket](https://github.com/devbucket))
- PWA-396 no error on second login retry [\#56](https://github.com/shopgate/pwa/pull/56) ([devbucket](https://github.com/devbucket))
- PWA-395 removed retries from the 'add...' Pipelines. [\#55](https://github.com/shopgate/pwa/pull/55) ([devbucket](https://github.com/devbucket))
- PWA-332 add test ids [\#54](https://github.com/shopgate/pwa/pull/54) ([devbucket](https://github.com/devbucket))
- TD-780 delete all readme files [\#52](https://github.com/shopgate/pwa/pull/52) ([devbucket](https://github.com/devbucket))
- Pwa 339 request handler unit tests [\#51](https://github.com/shopgate/pwa/pull/51) ([CarinaHoffmann](https://github.com/CarinaHoffmann))
- PI-8722 - bringing back .setSuppressErrors [\#49](https://github.com/shopgate/pwa/pull/49) ([sznowicki](https://github.com/sznowicki))
- PWA-361 PipelineManager now removes items from the pipeline sequence [\#48](https://github.com/shopgate/pwa/pull/48) ([richardgorman](https://github.com/richardgorman))
- CCP-505 Implemented the ScannerManager to enable simple access to the app scanner [\#47](https://github.com/shopgate/pwa/pull/47) ([fkloes](https://github.com/fkloes))
- PWA-337 integrate the cypress test suite [\#46](https://github.com/shopgate/pwa/pull/46) ([Iv3x](https://github.com/Iv3x))
- PI-8705-purchase-legacy-checkout [\#45](https://github.com/shopgate/pwa/pull/45) ([Carsten89](https://github.com/Carsten89))
- PI-8664 added default value to fix the purchase event [\#44](https://github.com/shopgate/pwa/pull/44) ([Carsten89](https://github.com/Carsten89))
- PWA-148: \[ux\] Dialog buttons are in the wrong order [\#42](https://github.com/shopgate/pwa/pull/42) ([CarinaHoffmann](https://github.com/CarinaHoffmann))
- Pwa 237 add action to flush toast messages [\#40](https://github.com/shopgate/pwa/pull/40) ([CarinaHoffmann](https://github.com/CarinaHoffmann))
- Td 660 move shared components [\#39](https://github.com/shopgate/pwa/pull/39) ([CarinaHoffmann](https://github.com/CarinaHoffmann))
- PWA-313: Fixed app crash on closeInAppBrowser command dispatch [\#38](https://github.com/shopgate/pwa/pull/38) ([fkloes](https://github.com/fkloes))
- PWA-307 add theme context [\#37](https://github.com/shopgate/pwa/pull/37) ([richardgorman](https://github.com/richardgorman))
- PWA-152 Unsubscribe history from openedRegisterLink$ stream. Unsubscr… [\#35](https://github.com/shopgate/pwa/pull/35) ([alexbridge](https://github.com/alexbridge))
- CCP-97: Implement AppPermissions commands [\#34](https://github.com/shopgate/pwa/pull/34) ([fkloes](https://github.com/fkloes))
- CCP-410 Images are now centered regardless of resolution [\#33](https://github.com/shopgate/pwa/pull/33) ([richardgorman](https://github.com/richardgorman))
- PWA-293: Fixed a bug within mergeTranslations helper [\#31](https://github.com/shopgate/pwa/pull/31) ([fkloes](https://github.com/fkloes))
- PWA-238: Sale discounts are incorrect [\#30](https://github.com/shopgate/pwa/pull/30) ([CarinaHoffmann](https://github.com/CarinaHoffmann))
- PWA-257 update to react 16.3 [\#28](https://github.com/shopgate/pwa/pull/28) ([richardgorman](https://github.com/richardgorman))
- CON-2887: Removed the login page from history when user gets logged-in [\#10](https://github.com/shopgate/pwa/pull/10) ([fkloes](https://github.com/fkloes))

## [v5.2.0](https://github.com/shopgate/pwa/tree/v5.2.0) (2018-04-24)
:nail_care: **Others:**

- PWA-284 Product hashes only contain filters if it is not empty [\#29](https://github.com/shopgate/pwa/pull/29) ([richardgorman](https://github.com/richardgorman))
- CCP-16: Prevent AppCommand dispatch on not supporting devices [\#27](https://github.com/shopgate/pwa/pull/27) ([fkloes](https://github.com/fkloes))
- Pwa 120 client selectors [\#26](https://github.com/shopgate/pwa/pull/26) ([CarinaHoffmann](https://github.com/CarinaHoffmann))
- PWA-236 Get portals only on instance. [\#25](https://github.com/shopgate/pwa/pull/25) ([devbucket](https://github.com/devbucket))
- PWA-218: Add portals to prices on category page [\#24](https://github.com/shopgate/pwa/pull/24) ([CarinaHoffmann](https://github.com/CarinaHoffmann))
- CCP-332: Added new constants for the cart.empty Portals [\#23](https://github.com/shopgate/pwa/pull/23) ([fkloes](https://github.com/fkloes))
- PWA-14 code splitting [\#22](https://github.com/shopgate/pwa/pull/22) ([devbucket](https://github.com/devbucket))
- Ccp 274 write review portal [\#21](https://github.com/shopgate/pwa/pull/21) ([Carsten89](https://github.com/Carsten89))
- PWA-118: unit test [\#20](https://github.com/shopgate/pwa/pull/20) ([CarinaHoffmann](https://github.com/CarinaHoffmann))
- CCP-203: Extended client selectors [\#19](https://github.com/shopgate/pwa/pull/19) ([fkloes](https://github.com/fkloes))

## [v5.1.0](https://github.com/shopgate/pwa/tree/v5.1.0) (2018-04-10)
:bug: **Fixed bugs:**

- PWA-186 Fix unit tests. [\#7](https://github.com/shopgate/pwa/pull/7) ([devbucket](https://github.com/devbucket))

:nail_care: **Others:**

- PWA-220 - AuthRoutes has default "to" prop. [\#17](https://github.com/shopgate/pwa/pull/17) ([sznowicki](https://github.com/sznowicki))
- PWA-114: Add portals around category list [\#16](https://github.com/shopgate/pwa/pull/16) ([CarinaHoffmann](https://github.com/CarinaHoffmann))
- Pwa 61 navigation bar [\#15](https://github.com/shopgate/pwa/pull/15) ([CarinaHoffmann](https://github.com/CarinaHoffmann))
- Merge remote-tracking branch 'origin/develop' into BIGC-713-tracking-fix [\#14](https://github.com/shopgate/pwa/pull/14) ([Carsten89](https://github.com/Carsten89))
- WEBC-567: Added handling for legacy connect registration errors [\#13](https://github.com/shopgate/pwa/pull/13) ([fkloes](https://github.com/fkloes))
- PWA-201: Added selectors for the flags of the getCart response [\#12](https://github.com/shopgate/pwa/pull/12) ([fkloes](https://github.com/fkloes))
- PWA-13 Add support for auth route portals [\#11](https://github.com/shopgate/pwa/pull/11) ([richardgorman](https://github.com/richardgorman))
- CCP-201 - PipelineRequest.suppressErrors [\#9](https://github.com/shopgate/pwa/pull/9) ([sznowicki](https://github.com/sznowicki))

## [v5.0.3](https://github.com/shopgate/pwa/tree/v5.0.3) (2018-03-23)
## [v5.0.2](https://github.com/shopgate/pwa/tree/v5.0.2) (2018-03-23)
:nail_care: **Others:**

- PWA-143 Pipeline names [\#8](https://github.com/shopgate/pwa/pull/8) ([devbucket](https://github.com/devbucket))

## [v5.0.1](https://github.com/shopgate/pwa/tree/v5.0.1) (2018-03-23)
## [v5.0.0](https://github.com/shopgate/pwa/tree/v5.0.0) (2018-03-23)
:rocket: **Enhancements:**

- PWA-103 add user menu portals [\#6](https://github.com/shopgate/pwa/pull/6) ([devbucket](https://github.com/devbucket))

:nail_care: **Others:**

- PWA-159 Arbitrary props are passed through Route [\#5](https://github.com/shopgate/pwa/pull/5) ([richardgorman](https://github.com/richardgorman))



\* *This Change Log was automatically generated by [github_changelog_generator](https://github.com/skywinder/Github-Changelog-Generator)*