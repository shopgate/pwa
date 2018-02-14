/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { combineReducers } from 'redux';

import client from '@shopgate/pwa-common/reducers/client';
import history from '@shopgate/pwa-common/reducers/history';
import url from '@shopgate/pwa-common/reducers/url';
import user from '@shopgate/pwa-common/reducers/user';
import page from '@shopgate/pwa-common/reducers/page';
import view from '@shopgate/pwa-common/reducers/view';
import menu from '@shopgate/pwa-common/reducers/menu';
import modal from '@shopgate/pwa-common/reducers/modal';
import toast from '@shopgate/pwa-common/reducers/toast';
import cart from '@shopgate/pwa-common-commerce/cart/reducers';
import category from '@shopgate/pwa-common-commerce/category/reducers';
import favorites from '@shopgate/pwa-common-commerce/favorites/reducers';
import filter from '@shopgate/pwa-common-commerce/filter/reducers';
import product from '@shopgate/pwa-common-commerce/product/reducers';
import search from '@shopgate/pwa-common-commerce/search/reducers';
import reviews from '@shopgate/pwa-common-commerce/reviews/reducers';
import navigator from 'Components/Navigator/reducer';
import extentions from 'Extensions/reducers';

import general from 'Components/View/reducer';
import categoryPage from 'Pages/Category/reducer';

const reducers = {
  cart,
  category,
  client,
  ...extentions && { extensions: combineReducers(extentions) },
  favorites,
  filter,
  history,
  menu,
  modal,
  navigator,
  page,
  product,
  reviews,
  search,
  toast,
  ui: combineReducers({
    general,
    categoryPage,
  }),
  url,
  user,
  view,
};

export default reducers;
