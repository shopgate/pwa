/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import client from '@shopgate/pwa-common/reducers/client';
import history from '@shopgate/pwa-common/reducers/history';
import user from '@shopgate/pwa-common/reducers/user';
import page from '@shopgate/pwa-common/reducers/page';
import view from '@shopgate/pwa-common/reducers/view';
import menu from '@shopgate/pwa-common/reducers/menu';
import cart from '@shopgate/pwa-common-commerce/cart/reducers';
import category from '@shopgate/pwa-common-commerce/category/reducers';
import currentProduct from '@shopgate/pwa-common-commerce/currentProduct/reducers';
import filter from '@shopgate/pwa-common-commerce/filter/reducers';
import product from '@shopgate/pwa-common-commerce/product/reducers';
import search from '@shopgate/pwa-common-commerce/search/reducers';
import navigator from 'Components/Navigator/reducer';

const reducers = {
  cart,
  category,
  client,
  currentProduct,
  filter,
  history,
  menu,
  navigator,
  page,
  product,
  search,
  user,
  view,
};

export default reducers;
