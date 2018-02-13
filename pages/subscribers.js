/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

// PWA Common
import commonApp from '@shopgate/pwa-common/subscriptions/app';
import commonUser from '@shopgate/pwa-common/subscriptions/user';
import commonHistory from '@shopgate/pwa-common/subscriptions/history';
import commonMenu from '@shopgate/pwa-common/subscriptions/menu';
// PWA Common Commerce
import commerceCart from '@shopgate/pwa-common-commerce/cart/subscriptions';
import commerceCategory from '@shopgate/pwa-common-commerce/category/subscriptions';
import commerceFavorites from '@shopgate/pwa-common-commerce/favorites/subscriptions';
import commerceFilter from '@shopgate/pwa-common-commerce/filter/subscriptions';
import commerceProduct from '@shopgate/pwa-common-commerce/product/subscriptions';
import commerceSearch from '@shopgate/pwa-common-commerce/search/subscriptions';
// PWA Tracking
import trackingSetup from '@shopgate/pwa-tracking/subscriptions/setup';
import trackingPages from '@shopgate/pwa-tracking/subscriptions/pages';
import trackingProduct from '@shopgate/pwa-tracking/subscriptions/product';
import trackingUser from '@shopgate/pwa-tracking/subscriptions/user';
import trackingCart from '@shopgate/pwa-tracking/subscriptions/cart';
import trackingCheckout from '@shopgate/pwa-tracking/subscriptions/checkout';
import trackingSearch from '@shopgate/pwa-tracking/subscriptions/search';
import trackingDeeplinkPush from '@shopgate/pwa-tracking/subscriptions/deeplinkPush';
// Theme
import navigator from 'Components/Navigator/subscriptions';
import category from 'Pages/Category/subscriptions';
import coupon from 'Pages/Cart/components/CouponField/subscriptions';
import favorites from 'Pages/Favorites/subscriptions';
import filter from 'Pages/Filter/subscriptions';
import login from 'Pages/Login/subscriptions';
import product from 'Pages/Product/subscriptions';
import search from 'Pages/Search/subscriptions';
import reviews from 'Pages/Reviews/subscriptions';
import filterbar from 'Components/FilterBar/subscriptions';
import writeReview from 'Pages/WriteReview/subscriptions';
import appConfig from '@shopgate/pwa-common/helpers/config';
// Extensions
import extensions from 'Extensions/subscribers';
// App
import app from './subscriptions';

const subscriptions = [
  // App subscribers.
  app,
  // Common subscribers.
  commonApp,
  commonHistory,
  commonUser,
  commonMenu,
  // Common Commerce subscribers.
  commerceCart,
  commerceCategory,
  commerceFavorites,
  commerceFilter,
  commerceProduct,
  commerceSearch,
  // Tracking subscribers.
  trackingSetup,
  trackingPages,
  trackingProduct,
  trackingUser,
  trackingCart,
  trackingCheckout,
  trackingSearch,
  trackingDeeplinkPush,
  // Theme subscribers.
  navigator,
  category,
  coupon,
  favorites,
  filter,
  filterbar,
  login,
  product,
  search,
  reviews,
  writeReview,
  // Extensions
  ...extensions,
];

if (appConfig.webCheckoutShopify !== null) {
  // eslint-disable-next-line global-require
  subscriptions.push(require('@shopgate/pwa-webcheckout-shopify/subscriptions').default);
}

export default subscriptions;
