/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import commerceCart from '@shopgate/pwa-common-commerce/cart/subscriptions';
import commerceCategory from '@shopgate/pwa-common-commerce/category/subscriptions';
import navigator from 'Components/Navigator/subscriptions';
// @TODO import coupons from './coupons';
import category from 'Pages/Category/subscriptions';
import filter from 'Pages/Filter/subscriptions';
import filterbar from 'Components/FilterBar/subscriptions';
import login from 'Pages/Login/subscriptions';

export default [
  commerceCart,
  commerceCategory,
  navigator,
  // @TODO coupons,
  category,
  filter,
  filterbar,
  login,
];
