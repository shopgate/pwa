/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
// @TODO import AuthRoutes from '@shopgate/pwa-common/components/router/auth-routes/AuthRoutes';
import Route from '@shopgate/pwa-common/components/router/route/Route';
import '@shopgate/pwa-common/styles/reset';
// @TODO import tracking from 'Library/tracking/core';
import App from '@shopgate/pwa-common/App';
import {
  INDEX_PATH,
  // PAGE_PATH,
  // LOGIN_PATH,
  // REGISTER_PATH,
} from '@shopgate/pwa-common/constants/RoutePaths';
// import {
//   CATEGORY_PATH,
//   FILTER_PATH,
//   ITEM_PATH,
//   SEARCH_PATH,
//   CART_PATH,
//   CHECKOUT_PATH,
//   ORDERS_PATH,
// } from '@shopgate/pwa-common-commerce/constants/RoutePaths';
import Viewport from '../components/Viewport';
// @TODO import { Dialog } from 'Templates/components';
import locale from '../locale';
import Page from './Page';

/**
 * The theme's main component defines all the routes (views) inside the application.
 * @returns {JSX}
 */
const Pages = () =>
  <App locale={locale}>
    <Viewport>
      <Route
        path={`${INDEX_PATH}`}
        component={Page}
      />
    </Viewport>
  </App>
;

export default Pages;
