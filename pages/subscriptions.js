/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import commerceCart from '@shopgate/pwa-common-commerce/cart/subscriptions';
import commerceCategory from '@shopgate/pwa-common-commerce/category/subscriptions';
import commerceFilter from '@shopgate/pwa-common-commerce/filter/subscriptions';
import navigator from 'Components/Navigator/subscriptions';
import category from 'Pages/Category/subscriptions';
// @TODO: import coupons from './coupons';
import filter from 'Pages/Filter/subscriptions';
import filterbar from 'Components/FilterBar/subscriptions';
import login from 'Pages/Login/subscriptions';

export default [
  commerceCart,
  commerceCategory,
  commerceFilter,
  navigator,
  category,
  // @TODO coupons,
  filter,
  filterbar,
  login,
];
