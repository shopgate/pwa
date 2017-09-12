/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import commerceCart from '@shopgate/pwa-common-commerce/cart/subscriptions';
import commerceCategory from '@shopgate/pwa-common-commerce/category/subscriptions';
import commerceFilter from '@shopgate/pwa-common-commerce/filter/subscriptions';
import tracking from '@shopgate/pwa-tracking/subscriptions';
import navigator from 'Components/Navigator/subscriptions';
import category from 'Pages/Category/subscriptions';
import coupon from 'Pages/Cart/components/CouponField/subscriptions';
import filter from 'Pages/Filter/subscriptions';
import login from 'Pages/Login/subscriptions';
import filterbar from 'Components/FilterBar/subscriptions';
import app from './subscriptions';

export default [
  commerceCart,
  commerceCategory,
  commerceFilter,
  ...tracking,
  app,
  navigator,
  category,
  coupon,
  filter,
  filterbar,
  login,
];
