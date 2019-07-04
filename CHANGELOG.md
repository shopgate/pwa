# Changelog

## [v5.10.3](https://github.com/shopgate/pwa/compare/v5.10.2...v5.10.3) (2019-01-07)

#### :rocket: Enhancement
* [#462](https://github.com/shopgate/pwa/pull/462) Modified HttpRequest class in core ([DannyShopgate](https://github.com/DannyShopgate))
* [#459](https://github.com/shopgate/pwa/pull/459) Update Spanish translations ([Bettina-Baumert](https://github.com/Bettina-Baumert))
* [#456](https://github.com/shopgate/pwa/pull/456) Reset margin of Register links ([richardgorman](https://github.com/richardgorman))
* [#444](https://github.com/shopgate/pwa/pull/444) Removed text selection for product descriptions ([richardgorman](https://github.com/richardgorman))

#### :bug: Bug Fix
* [#478](https://github.com/shopgate/pwa/pull/478) Fixed invalid it-IT language file ([fkloes](https://github.com/fkloes))
* [#476](https://github.com/shopgate/pwa/pull/476) Fix more products load for product list widget ([alexbridge](https://github.com/alexbridge))
* [#467](https://github.com/shopgate/pwa/pull/467) Increased hit area of the cart item context menu ([fkloes](https://github.com/fkloes))
* [#466](https://github.com/shopgate/pwa/pull/466) Fixed faulty getProducts call with productIds and filters ([fkloes](https://github.com/fkloes))
* [#452](https://github.com/shopgate/pwa/pull/452) Changed .gitignore to only ignore the theme's config folder. ([devbucket](https://github.com/devbucket))
* [#448](https://github.com/shopgate/pwa/pull/448) Moved the link around the buttons on iOS UserMenu ([richardgorman](https://github.com/richardgorman))
* [#425](https://github.com/shopgate/pwa/pull/425) Change to getProductsById action that keeps original hash when some requested products are already cached. Make Product widget responsive to settings changes after mounting ([aaron-martin](https://github.com/aaron-martin))


## [v5.10.2](https://github.com/shopgate/pwa/compare/v5.10.1...v5.10.2) (2018-11-23)


## [v5.10.1](https://github.com/shopgate/pwa/compare/v5.10.0...v5.10.1) (2018-11-16)

#### :bug: Bug Fix
* [#393](https://github.com/shopgate/pwa/pull/393) Replaced deprecated FR, LV, FE and GE iso province codes ([SG-Noxoreos](https://github.com/SG-Noxoreos))
* [#387](https://github.com/shopgate/pwa/pull/387) Added flushTab option for legacy links within the parsed-link helper ([fkloes](https://github.com/fkloes))

#### :nail_care: Polish
* [#394](https://github.com/shopgate/pwa/pull/394) Fix eslint errors in the form builder ([alexbridge](https://github.com/alexbridge))
* [#390](https://github.com/shopgate/pwa/pull/390) Extend timeout for test stability ([Iv3x](https://github.com/Iv3x))
* [#389](https://github.com/shopgate/pwa/pull/389) Added spec files for e2e execution ([Iv3x](https://github.com/Iv3x))


## [v5.10.0](https://github.com/shopgate/pwa/compare/v5.9.1...v5.10.0) (2018-11-12)

#### :bug: Bug Fix
* [#371](https://github.com/shopgate/pwa/pull/371) Correct price formatting on product detail page when price is 0 ([aaron-martin](https://github.com/aaron-martin))
* [#370](https://github.com/shopgate/pwa/pull/370) Fixed an inAppBrowser issue where previous opened pages got visible again ([fkloes](https://github.com/fkloes))
* [#368](https://github.com/shopgate/pwa/pull/368) Corrected a bug where the filters labels can run out of the viewport ([richardgorman](https://github.com/richardgorman))
* [#363](https://github.com/shopgate/pwa/pull/363) Updated `react-hot-loader` to prevent issues with newer `react` version. ([devbucket](https://github.com/devbucket))

#### :nail_care: Polish
* [#359](https://github.com/shopgate/pwa/pull/359) My account menu header portal ([alexbridge](https://github.com/alexbridge))
* [#355](https://github.com/shopgate/pwa/pull/355) Added possibility to open legacy `user\_lost\_password` link ([philipp-heyse](https://github.com/philipp-heyse))
* [#350](https://github.com/shopgate/pwa/pull/350) Added automatic changelog generation and handling for stable releases. ([SG-Noxoreos](https://github.com/SG-Noxoreos))
* [#334](https://github.com/shopgate/pwa/pull/334) fix linting errors for e2e test suite ([Iv3x](https://github.com/Iv3x))


## [v5.9.1](https://github.com/shopgate/pwa/compare/v5.9.0...v5.9.1) (2018-11-23)

#### :rocket: Enhancement
* [#381](https://github.com/shopgate/pwa/pull/381) Added portals and location prop for product-item.price ([DannyShopgate](https://github.com/DannyShopgate))

#### :bug: Bug Fix
* [#404](https://github.com/shopgate/pwa/pull/404) Improve concurrent cart actions, when adding a coupon from deeplink ([alexbridge](https://github.com/alexbridge))

#### :nail_care: Polish
* [#400](https://github.com/shopgate/pwa/pull/400) Added new portals and exported selectors ([Carsten89](https://github.com/Carsten89))


## [v5.9.0](https://github.com/shopgate/pwa/compare/v5.8.0...v5.9.0) (2018-10-30)

#### :rocket: Enhancement
* [#342](https://github.com/shopgate/pwa/pull/342) Makefile improvements ([SG-Noxoreos](https://github.com/SG-Noxoreos))
* [#338](https://github.com/shopgate/pwa/pull/338) Introduced automatic creation of github releases ([SG-Noxoreos](https://github.com/SG-Noxoreos))
* [#332](https://github.com/shopgate/pwa/pull/332) Implemented iOS and Android Share icons and Native Share App Command ([DannyShopgate](https://github.com/DannyShopgate))
* [#331](https://github.com/shopgate/pwa/pull/331) The browser connector is used only in none SDK web environments. ([devbucket](https://github.com/devbucket))
* [#330](https://github.com/shopgate/pwa/pull/330) Added an action that allows to disable/enable the login form ([reneeichhorn](https://github.com/reneeichhorn))
* [#327](https://github.com/shopgate/pwa/pull/327) Sheet accepts className prop. ([sznowicki](https://github.com/sznowicki))
* [#310](https://github.com/shopgate/pwa/pull/310) A getProductRelations pipeline redux implementation ([sznowicki](https://github.com/sznowicki))
* [#291](https://github.com/shopgate/pwa/pull/291) Implemented the EmbeddedMedia collection to improve handling of playing media on navigation ([fkloes](https://github.com/fkloes))
* [#284](https://github.com/shopgate/pwa/pull/284) Added a library for benchmarking and added a public api for it. ([reneeichhorn](https://github.com/reneeichhorn))
* [#279](https://github.com/shopgate/pwa/pull/279) Portals: Sending original component down to the portal instance. ([Carsten89](https://github.com/Carsten89))
* [#278](https://github.com/shopgate/pwa/pull/278) Added Pull Request Template and automatic changelog creation. ([devbucket](https://github.com/devbucket))
* [#32](https://github.com/shopgate/pwa/pull/32) Implemented BrowserConnector to be able to call Pipelines fro a non App environment \(browser\) ([devbucket](https://github.com/devbucket))

#### :bug: Bug Fix
* [#333](https://github.com/shopgate/pwa/pull/333) CartButton and SearchButton are now reliably hidden on cart page ([fkloes](https://github.com/fkloes))
* [#328](https://github.com/shopgate/pwa/pull/328) Added default limit for getProductsRelations action ([sznowicki](https://github.com/sznowicki))
* [#319](https://github.com/shopgate/pwa/pull/319) Fixed a broken import ([sznowicki](https://github.com/sznowicki))
* [#315](https://github.com/shopgate/pwa/pull/315) Fix product price in favorites to match product actual price ([alexbridge](https://github.com/alexbridge))
* [#313](https://github.com/shopgate/pwa/pull/313) Moved from @shopgate/react-hammerjs to react-hammerjs from npm. ([devbucket](https://github.com/devbucket))
* [#302](https://github.com/shopgate/pwa/pull/302) Fixed hammer.js by fixing the version to 0.5.6 ([devbucket](https://github.com/devbucket))
* [#295](https://github.com/shopgate/pwa/pull/295) Fix UI separating line between coupon and coupon field. ([alexbridge](https://github.com/alexbridge))
* [#293](https://github.com/shopgate/pwa/pull/293) Removed country codes from province province codes used by the form builder ([SG-Noxoreos](https://github.com/SG-Noxoreos))
* [#289](https://github.com/shopgate/pwa/pull/289) Moved out the benchmarking tool out from devDependencies to the dependency list ([SG-Noxoreos](https://github.com/SG-Noxoreos))
* [#288](https://github.com/shopgate/pwa/pull/288) A rebuildOnUpdate prop implemented to a Slider. ([sznowicki](https://github.com/sznowicki))
* [#287](https://github.com/shopgate/pwa/pull/287) Added iPhoneXs, XsMax and Xr support ([Carsten89](https://github.com/Carsten89))


#### :nail_care: Polish
* [#326](https://github.com/shopgate/pwa/pull/326) E2E tests for user Address Book ([alexbridge](https://github.com/alexbridge))
* [#317](https://github.com/shopgate/pwa/pull/317) Changed Makefile to support subtrees and prepare it for additional automation ([SG-Noxoreos](https://github.com/SG-Noxoreos))
* [#305](https://github.com/shopgate/pwa/pull/305) fixed a typo in a translation ([chrisEff](https://github.com/chrisEff))
* [#304](https://github.com/shopgate/pwa/pull/304) fixed a typo in a translation ([chrisEff](https://github.com/chrisEff))
* [#300](https://github.com/shopgate/pwa/pull/300) clientInformation is taken from window.navigator instead of webStorage ([devbucket](https://github.com/devbucket))
* [#298](https://github.com/shopgate/pwa/pull/298) Changed test IDs and tests to not depend on exact same data and be able to run with similar data. ([Iv3x](https://github.com/Iv3x))
* [#294](https://github.com/shopgate/pwa/pull/294) Move from Git submodules to Git subtree ([devbucket](https://github.com/devbucket))
* [#290](https://github.com/shopgate/pwa/pull/290) Added selectors for product properties and cartItemById ([Carsten89](https://github.com/Carsten89))
* [#281](https://github.com/shopgate/pwa/pull/281) TD-864-optimize-portal ([Carsten89](https://github.com/Carsten89))
* [#277](https://github.com/shopgate/pwa/pull/277) Pwa 887 ([reneeichhorn](https://github.com/reneeichhorn))
* [#272](https://github.com/shopgate/pwa/pull/272) PWA-706-fix-portal-usage ([SG-Noxoreos](https://github.com/SG-Noxoreos))
* [#269](https://github.com/shopgate/pwa/pull/269) Pwa 706 address management ([SG-Noxoreos](https://github.com/SG-Noxoreos))


## [v5.8.0](https://github.com/shopgate/pwa/compare/v5.7.4...v5.8.0) (2018-09-18)

#### :rocket: Enhancement
* [#243](https://github.com/shopgate/pwa/pull/243) PWA-885 create deployment test ([Iv3x](https://github.com/Iv3x))


## [v5.7.4](https://github.com/shopgate/pwa/compare/v5.7.3...v5.7.4) (2018-09-07)

#### :nail_care: Polish
* [#239](https://github.com/shopgate/pwa/pull/239) Shopify 529 create a new portal ([awesselburg](https://github.com/awesselburg))
* [#238](https://github.com/shopgate/pwa/pull/238) CCP-812 added portals for prices in favlist ([Carsten89](https://github.com/Carsten89))
* [#234](https://github.com/shopgate/pwa/pull/234) PWA-746: Fixed an issue with user review updates ([fkloes](https://github.com/fkloes))
* [#226](https://github.com/shopgate/pwa/pull/226) PWA-829: added second condition to determin if slider.fixLoop should … ([Shopgate-Travis](https://github.com/Shopgate-Travis))


## [v5.7.3](https://github.com/shopgate/pwa/compare/v5.7.2...v5.7.3) (2018-08-26)


## [v5.7.2](https://github.com/shopgate/pwa/compare/v5.7.1...v5.7.2) (2018-08-25)


## [v5.7.1](https://github.com/shopgate/pwa/compare/v5.7.0...v5.7.1) (2018-08-25)


## [v5.7.0](https://github.com/shopgate/pwa/compare/v5.6.0...v5.7.0) (2018-08-24)

#### :bug: Bug Fix
* [#225](https://github.com/shopgate/pwa/pull/225) PWA-873 Fixed unit test suite and updated snapshots. ([devbucket](https://github.com/devbucket))

#### :nail_care: Polish
* [#222](https://github.com/shopgate/pwa/pull/222) CCP-144-dialog-btn-txt-align ([Carsten89](https://github.com/Carsten89))
* [#210](https://github.com/shopgate/pwa/pull/210) PWA-723 e2e test for native checkout ([Iv3x](https://github.com/Iv3x))
* [#208](https://github.com/shopgate/pwa/pull/208) Pwa 773 ([sznowicki](https://github.com/sznowicki))
* [#205](https://github.com/shopgate/pwa/pull/205) PWA-389 Sync mock for pipeline request ([sofib](https://github.com/sofib))
* [#200](https://github.com/shopgate/pwa/pull/200) PWA-749 updated hashes ([Iv3x](https://github.com/Iv3x))
* [#198](https://github.com/shopgate/pwa/pull/198) Pwa 73 onload command clean ([sznowicki](https://github.com/sznowicki))
* [#192](https://github.com/shopgate/pwa/pull/192) Pwa 364 physical pixel size helper ([sznowicki](https://github.com/sznowicki))


## [v5.6.0](https://github.com/shopgate/pwa/compare/v5.5.0...v5.6.0) (2018-08-09)

#### :nail_care: Polish
* [#206](https://github.com/shopgate/pwa/pull/206) PWA-704 fixed issue with cached items ([Carsten89](https://github.com/Carsten89))
* [#195](https://github.com/shopgate/pwa/pull/195) PWA-747: Extended jest.config ([fkloes](https://github.com/fkloes))
* [#191](https://github.com/shopgate/pwa/pull/191) PWA-747: Extended jest.config to fix tests ([fkloes](https://github.com/fkloes))
* [#190](https://github.com/shopgate/pwa/pull/190) Pwa 744 ([Carsten89](https://github.com/Carsten89))
* [#188](https://github.com/shopgate/pwa/pull/188) PWA-743 - hide loading spinner when totalItems is lower than actually… ([sznowicki](https://github.com/sznowicki))
* [#185](https://github.com/shopgate/pwa/pull/185) PWA-73 - hide splashscreen after app did start to make all listeners … ([sznowicki](https://github.com/sznowicki))
* [#184](https://github.com/shopgate/pwa/pull/184) PWA-721 - request available filters on search query change ([sznowicki](https://github.com/sznowicki))
* [#180](https://github.com/shopgate/pwa/pull/180) V5.7 ([sznowicki](https://github.com/sznowicki))
* [#178](https://github.com/shopgate/pwa/pull/178) Pwa 718 user review always on top ([sznowicki](https://github.com/sznowicki))
* [#176](https://github.com/shopgate/pwa/pull/176) PWA-252 - removing the valueLabels in the correct way ([sznowicki](https://github.com/sznowicki))
* [#174](https://github.com/shopgate/pwa/pull/174) Pwa 487 checkout action timeouts ([sznowicki](https://github.com/sznowicki))
* [#166](https://github.com/shopgate/pwa/pull/166) PWA-679 Fix pipeline manager issues ([fkloes](https://github.com/fkloes))
* [#163](https://github.com/shopgate/pwa/pull/163) PWA-690 Rectify ESLint issues for themes ([alexbridge](https://github.com/alexbridge))
* [#162](https://github.com/shopgate/pwa/pull/162) Pwa 656 backdrop enhancements ([sznowicki](https://github.com/sznowicki))
* [#161](https://github.com/shopgate/pwa/pull/161) MAGENTO-2044 - add lib version ([awesselburg](https://github.com/awesselburg))
* [#156](https://github.com/shopgate/pwa/pull/156) PWA-255 ([Carsten89](https://github.com/Carsten89))
* [#155](https://github.com/shopgate/pwa/pull/155) MAGENTO-2044 - add setCookie App command ([awesselburg](https://github.com/awesselburg))
* [#153](https://github.com/shopgate/pwa/pull/153) PI-8827 fixed not spinning indicator circle for search ([Carsten89](https://github.com/Carsten89))
* [#151](https://github.com/shopgate/pwa/pull/151) PWA-675 Prevent duplicate message modals ([fkloes](https://github.com/fkloes))
* [#150](https://github.com/shopgate/pwa/pull/150) PWA-639 Add Select form element to ui-shared components ([alexbridge](https://github.com/alexbridge))
* [#147](https://github.com/shopgate/pwa/pull/147) PWA-654 - some app events must be registered before they are used ([sznowicki](https://github.com/sznowicki))
* [#146](https://github.com/shopgate/pwa/pull/146) PWA-594 updated hashes ([Iv3x](https://github.com/Iv3x))
* [#144](https://github.com/shopgate/pwa/pull/144) Pwa 475 error handling for categories ([sznowicki](https://github.com/sznowicki))
* [#143](https://github.com/shopgate/pwa/pull/143) PWA-658 Suppress ENOTFOUND by default ([alexbridge](https://github.com/alexbridge))
* [#141](https://github.com/shopgate/pwa/pull/141) Pwa 605 sg tracking meta data ([sznowicki](https://github.com/sznowicki))
* [#140](https://github.com/shopgate/pwa/pull/140) PWA-593 updated hashes ([Iv3x](https://github.com/Iv3x))
* [#139](https://github.com/shopgate/pwa/pull/139) PWA-592 updated hashes ([Iv3x](https://github.com/Iv3x))
* [#137](https://github.com/shopgate/pwa/pull/137) Ccp 449 pollin order form ([Carsten89](https://github.com/Carsten89))
* [#135](https://github.com/shopgate/pwa/pull/135) PWA-503 - z-index fixes for PDP ([sznowicki](https://github.com/sznowicki))
* [#133](https://github.com/shopgate/pwa/pull/133) PWA-580 - sgapi links must not have trailing slashes ([sznowicki](https://github.com/sznowicki))
* [#132](https://github.com/shopgate/pwa/pull/132) CCP-684: added support for ctaPrimary and ctaPrimaryContrast to AddTo… ([aaron-martin](https://github.com/aaron-martin))
* [#131](https://github.com/shopgate/pwa/pull/131) PWA-584 e2e functional cart ([Iv3x](https://github.com/Iv3x))


## [v5.5.0](https://github.com/shopgate/pwa/compare/v5.4.1...v5.5.0) (2018-07-06)

#### :bug: Bug Fix
* [#138](https://github.com/shopgate/pwa/pull/138) PWA-373 Add currency to app default config ([alexbridge](https://github.com/alexbridge))

#### :nail_care: Polish
* [#145](https://github.com/shopgate/pwa/pull/145) PWA-659 fixed image gallery on ios10 ([Carsten89](https://github.com/Carsten89))
* [#136](https://github.com/shopgate/pwa/pull/136) PWA-604: Pages are tracked anymore when the user enters the checkout ([fkloes](https://github.com/fkloes))
* [#130](https://github.com/shopgate/pwa/pull/130) PWA-567: ProductSlider items now have equal heights ([fkloes](https://github.com/fkloes))
* [#128](https://github.com/shopgate/pwa/pull/128) CCP-691 - pause animation of spinner on add to cart ([sznowicki](https://github.com/sznowicki))
* [#126](https://github.com/shopgate/pwa/pull/126) PWA-581 e2e functional ([Iv3x](https://github.com/Iv3x))
* [#125](https://github.com/shopgate/pwa/pull/125) CCP-680: Added onSelect callback to the PickerComponent ([fkloes](https://github.com/fkloes))
* [#124](https://github.com/shopgate/pwa/pull/124) PWA-564 e2e functional ([Iv3x](https://github.com/Iv3x))
* [#123](https://github.com/shopgate/pwa/pull/123) PWA-552 ([SG-Noxoreos](https://github.com/SG-Noxoreos))
* [#118](https://github.com/shopgate/pwa/pull/118) PWA-559 pass state and subscribe to tracking plugins ([Carsten89](https://github.com/Carsten89))
* [#117](https://github.com/shopgate/pwa/pull/117) CCP-670 added custom event ([Carsten89](https://github.com/Carsten89))
* [#116](https://github.com/shopgate/pwa/pull/116) Ccp 642 release items on favorite list changes ([aaron-martin](https://github.com/aaron-martin))
* [#114](https://github.com/shopgate/pwa/pull/114) PWA-347 Replace onTouchTap with onClick for Checkbox component ([alexbridge](https://github.com/alexbridge))
* [#112](https://github.com/shopgate/pwa/pull/112) CCP-656: Improved cartProductPendingCount ([fkloes](https://github.com/fkloes))
* [#110](https://github.com/shopgate/pwa/pull/110) PWA-502 - support for single selection filters \(constant + shared Rad… ([sznowicki](https://github.com/sznowicki))
* [#107](https://github.com/shopgate/pwa/pull/107) PWA-484 fix favorites add products to cart to comply with specification ([SG-Noxoreos](https://github.com/SG-Noxoreos))
* [#106](https://github.com/shopgate/pwa/pull/106) PWA-527 e2e test favorites ([Iv3x](https://github.com/Iv3x))
* [#105](https://github.com/shopgate/pwa/pull/105) CCP-446 export getProductPropertiesState selector ([Carsten89](https://github.com/Carsten89))
* [#104](https://github.com/shopgate/pwa/pull/104) PWA-150 Add Radio button checked, unchecked icons ([alexbridge](https://github.com/alexbridge))
* [#102](https://github.com/shopgate/pwa/pull/102) Pwa 378 parse internal links correctly ([sznowicki](https://github.com/sznowicki))
* [#100](https://github.com/shopgate/pwa/pull/100) PWA-515 e2e test reviews ([Iv3x](https://github.com/Iv3x))
* [#98](https://github.com/shopgate/pwa/pull/98) Ccp 637 styles in widgets ([sznowicki](https://github.com/sznowicki))
* [#94](https://github.com/shopgate/pwa/pull/94) PWA-428 Link has a new property disabled ([alexbridge](https://github.com/alexbridge))


## [v5.4.1](https://github.com/shopgate/pwa/compare/v5.4.0...v5.4.1) (2018-06-11)


## [v5.4.0](https://github.com/shopgate/pwa/compare/v5.3.0...v5.4.0) (2018-06-11)

#### :nail_care: Polish
* [#93](https://github.com/shopgate/pwa/pull/93) PWA-177: Track pages when coming back from legacy pages ([fkloes](https://github.com/fkloes))
* [#91](https://github.com/shopgate/pwa/pull/91) CCP-631 - favorites portals ([sznowicki](https://github.com/sznowicki))
* [#87](https://github.com/shopgate/pwa/pull/87) PWA-513 e2e test filter ([Iv3x](https://github.com/Iv3x))
* [#85](https://github.com/shopgate/pwa/pull/85) PWA-510 e2e test login ([Iv3x](https://github.com/Iv3x))
* [#82](https://github.com/shopgate/pwa/pull/82) PWA-451 e2e test search ([Iv3x](https://github.com/Iv3x))
* [#80](https://github.com/shopgate/pwa/pull/80) PWA-488: Added new favoritesDidUpdate$ stream ([fkloes](https://github.com/fkloes))
* [#77](https://github.com/shopgate/pwa/pull/77) Pwa-450 e2e test cart ([Iv3x](https://github.com/Iv3x))
* [#76](https://github.com/shopgate/pwa/pull/76) CCP-594 - scheduled widgets support ([sznowicki](https://github.com/sznowicki))
* [#72](https://github.com/shopgate/pwa/pull/72) PWA-437: Favourite list has issues with "out of stock" items ([CarinaHoffmann](https://github.com/CarinaHoffmann))
* [#71](https://github.com/shopgate/pwa/pull/71) Pwa 438 test coverage ([Iv3x](https://github.com/Iv3x))
* [#69](https://github.com/shopgate/pwa/pull/69) PWA-334 e2e productpage ([Iv3x](https://github.com/Iv3x))
* [#61](https://github.com/shopgate/pwa/pull/61) PWA-333 ([Iv3x](https://github.com/Iv3x))
* [#58](https://github.com/shopgate/pwa/pull/58) CCP-546 - navigator portals ([sznowicki](https://github.com/sznowicki))
* [#36](https://github.com/shopgate/pwa/pull/36) CCP-454-implement-plotproject-commands ([Carsten89](https://github.com/Carsten89))


## [v5.3.0](https://github.com/shopgate/pwa/compare/v5.2.0...v5.3.0) (2018-05-24)

#### :rocket: Enhancement
* [#50](https://github.com/shopgate/pwa/pull/50) Parameters of original url are not duplicated, added tests ([sofib](https://github.com/sofib))
* [#41](https://github.com/shopgate/pwa/pull/41) PWA-299: Refactored / Implemented error handling. ([devbucket](https://github.com/devbucket))

#### :bug: Bug Fix
* [#63](https://github.com/shopgate/pwa/pull/63) PWA-424 Handling process sequencial correctly. ([devbucket](https://github.com/devbucket))

#### :nail_care: Polish
* [#60](https://github.com/shopgate/pwa/pull/60) PWA-403: Error handling: Pipeline not yield a response ([CarinaHoffmann](https://github.com/CarinaHoffmann))
* [#59](https://github.com/shopgate/pwa/pull/59) PWA-402 fix is orderable ([devbucket](https://github.com/devbucket))
* [#57](https://github.com/shopgate/pwa/pull/57) PWA-393 send hide splash screen command. ([devbucket](https://github.com/devbucket))
* [#56](https://github.com/shopgate/pwa/pull/56) PWA-396 no error on second login retry ([devbucket](https://github.com/devbucket))
* [#55](https://github.com/shopgate/pwa/pull/55) PWA-395 removed retries from the 'add...' Pipelines. ([devbucket](https://github.com/devbucket))
* [#54](https://github.com/shopgate/pwa/pull/54) PWA-332 add test ids ([devbucket](https://github.com/devbucket))
* [#52](https://github.com/shopgate/pwa/pull/52) TD-780 delete all readme files ([devbucket](https://github.com/devbucket))
* [#51](https://github.com/shopgate/pwa/pull/51) Pwa 339 request handler unit tests ([CarinaHoffmann](https://github.com/CarinaHoffmann))
* [#49](https://github.com/shopgate/pwa/pull/49) PI-8722 - bringing back .setSuppressErrors ([sznowicki](https://github.com/sznowicki))
* [#48](https://github.com/shopgate/pwa/pull/48) PWA-361 PipelineManager now removes items from the pipeline sequence ([richardgorman](https://github.com/richardgorman))
* [#47](https://github.com/shopgate/pwa/pull/47) CCP-505 Implemented the ScannerManager to enable simple access to the app scanner ([fkloes](https://github.com/fkloes))
* [#46](https://github.com/shopgate/pwa/pull/46) PWA-337 integrate the cypress test suite ([Iv3x](https://github.com/Iv3x))
* [#45](https://github.com/shopgate/pwa/pull/45) PI-8705-purchase-legacy-checkout ([Carsten89](https://github.com/Carsten89))
* [#44](https://github.com/shopgate/pwa/pull/44) PI-8664 added default value to fix the purchase event ([Carsten89](https://github.com/Carsten89))
* [#42](https://github.com/shopgate/pwa/pull/42) PWA-148: \[ux\] Dialog buttons are in the wrong order ([CarinaHoffmann](https://github.com/CarinaHoffmann))
* [#40](https://github.com/shopgate/pwa/pull/40) Pwa 237 add action to flush toast messages ([CarinaHoffmann](https://github.com/CarinaHoffmann))
* [#39](https://github.com/shopgate/pwa/pull/39) Td 660 move shared components ([CarinaHoffmann](https://github.com/CarinaHoffmann))
* [#38](https://github.com/shopgate/pwa/pull/38) PWA-313: Fixed app crash on closeInAppBrowser command dispatch ([fkloes](https://github.com/fkloes))
* [#37](https://github.com/shopgate/pwa/pull/37) PWA-307 add theme context ([richardgorman](https://github.com/richardgorman))
* [#35](https://github.com/shopgate/pwa/pull/35) PWA-152 Unsubscribe history from openedRegisterLink$ stream. Unsubscr… ([alexbridge](https://github.com/alexbridge))
* [#34](https://github.com/shopgate/pwa/pull/34) CCP-97: Implement AppPermissions commands ([fkloes](https://github.com/fkloes))
* [#33](https://github.com/shopgate/pwa/pull/33) CCP-410 Images are now centered regardless of resolution ([richardgorman](https://github.com/richardgorman))
* [#31](https://github.com/shopgate/pwa/pull/31) PWA-293: Fixed a bug within mergeTranslations helper ([fkloes](https://github.com/fkloes))
* [#30](https://github.com/shopgate/pwa/pull/30) PWA-238: Sale discounts are incorrect ([CarinaHoffmann](https://github.com/CarinaHoffmann))
* [#28](https://github.com/shopgate/pwa/pull/28) PWA-257 update to react 16.3 ([richardgorman](https://github.com/richardgorman))
* [#10](https://github.com/shopgate/pwa/pull/10) CON-2887: Removed the login page from history when user gets logged-in ([fkloes](https://github.com/fkloes))


## [v5.2.0](https://github.com/shopgate/pwa/compare/v5.1.0...v5.2.0) (2018-04-24)

#### :nail_care: Polish
* [#29](https://github.com/shopgate/pwa/pull/29) PWA-284 Product hashes only contain filters if it is not empty ([richardgorman](https://github.com/richardgorman))
* [#27](https://github.com/shopgate/pwa/pull/27) CCP-16: Prevent AppCommand dispatch on not supporting devices ([fkloes](https://github.com/fkloes))
* [#26](https://github.com/shopgate/pwa/pull/26) Pwa 120 client selectors ([CarinaHoffmann](https://github.com/CarinaHoffmann))
* [#25](https://github.com/shopgate/pwa/pull/25) PWA-236 Get portals only on instance. ([devbucket](https://github.com/devbucket))
* [#24](https://github.com/shopgate/pwa/pull/24) PWA-218: Add portals to prices on category page ([CarinaHoffmann](https://github.com/CarinaHoffmann))
* [#23](https://github.com/shopgate/pwa/pull/23) CCP-332: Added new constants for the cart.empty Portals ([fkloes](https://github.com/fkloes))
* [#22](https://github.com/shopgate/pwa/pull/22) PWA-14 code splitting ([devbucket](https://github.com/devbucket))
* [#21](https://github.com/shopgate/pwa/pull/21) Ccp 274 write review portal ([Carsten89](https://github.com/Carsten89))
* [#20](https://github.com/shopgate/pwa/pull/20) PWA-118: unit test ([CarinaHoffmann](https://github.com/CarinaHoffmann))
* [#19](https://github.com/shopgate/pwa/pull/19) CCP-203: Extended client selectors ([fkloes](https://github.com/fkloes))


## [v5.1.0](https://github.com/shopgate/pwa/compare/v5.0.3...v5.1.0) (2018-04-10)

#### :bug: Bug Fix
* [#7](https://github.com/shopgate/pwa/pull/7) PWA-186 Fix unit tests. ([devbucket](https://github.com/devbucket))

#### :nail_care: Polish
* [#17](https://github.com/shopgate/pwa/pull/17) PWA-220 - AuthRoutes has default "to" prop. ([sznowicki](https://github.com/sznowicki))
* [#16](https://github.com/shopgate/pwa/pull/16) PWA-114: Add portals around category list ([CarinaHoffmann](https://github.com/CarinaHoffmann))
* [#15](https://github.com/shopgate/pwa/pull/15) Pwa 61 navigation bar ([CarinaHoffmann](https://github.com/CarinaHoffmann))
* [#14](https://github.com/shopgate/pwa/pull/14) Merge remote-tracking branch 'origin/develop' into BIGC-713-tracking-fix ([Carsten89](https://github.com/Carsten89))
* [#13](https://github.com/shopgate/pwa/pull/13) WEBC-567: Added handling for legacy connect registration errors ([fkloes](https://github.com/fkloes))
* [#12](https://github.com/shopgate/pwa/pull/12) PWA-201: Added selectors for the flags of the getCart response ([fkloes](https://github.com/fkloes))
* [#11](https://github.com/shopgate/pwa/pull/11) PWA-13 Add support for auth route portals ([richardgorman](https://github.com/richardgorman))
* [#9](https://github.com/shopgate/pwa/pull/9) CCP-201 - PipelineRequest.suppressErrors ([sznowicki](https://github.com/sznowicki))


## [v5.0.3](https://github.com/shopgate/pwa/compare/v5.0.2...v5.0.3) (2018-03-23)


## [v5.0.2](https://github.com/shopgate/pwa/compare/v5.0.1...v5.0.2) (2018-03-23)

#### :nail_care: Polish
* [#8](https://github.com/shopgate/pwa/pull/8) PWA-143 Pipeline names ([devbucket](https://github.com/devbucket))

## [v5.0.1](https://github.com/shopgate/pwa/compare/v5.0.0...v5.0.1) (2018-03-23)


## [v5.0.0](https://github.com/shopgate/pwa/tree/v5.0.0) (2018-03-23)

#### :rocket: Enhancement
* [#6](https://github.com/shopgate/pwa/pull/6) PWA-103 add user menu portals ([devbucket](https://github.com/devbucket))

#### :nail_care: Polish
* [#5](https://github.com/shopgate/pwa/pull/5) PWA-159 Arbitrary props are passed through Route ([richardgorman](https://github.com/richardgorman))


## [Changelog for versions before v5.0.0](https://github.com/shopgate/theme-gmd/blob/v4.3.0/CHANGELOG.md)
