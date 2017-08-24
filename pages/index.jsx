/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Helmet from 'react-helmet';
// @TODO import AuthRoutes from '@shopgate/pwa-common/components/router/auth-routes/AuthRoutes';
import Route from '@shopgate/pwa-common/components/Router/components/Route';
import '@shopgate/pwa-common/styles/reset';
import 'Styles/fonts';
// @TODO import tracking from 'Library/tracking/core';
import App from '@shopgate/pwa-common/App';
import {
  INDEX_PATH,
  PAGE_PATH,
  // LOGIN_PATH,
  // REGISTER_PATH,
} from '@shopgate/pwa-common/constants/RoutePaths';
import { CATEGORY_PATH } from '@shopgate/pwa-common-commerce/category/constants';
// @TODO: import { FILTER_PATH } from '@shopgate/pwa-common-commerce/filter/constants';
// @TODO: import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
// @TODO: import { SEARCH_PATH } from '@shopgate/pwa-common-commerce/search/constants';
// @TODO: import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
// @TODO: import { CHECKOUT_PATH } from '@shopgate/pwa-common-commerce/checkout/constants';
import Viewport from '../components/Viewport';
// @TODO import { Dialog } from 'Templates/components';
import locale from '../locale';
import reducers from './reducers';
import subscriptions from './subscriptions';
import Page from './Page';
import Category from './Category';

/**
 * The theme's main component defines all the routes (views) inside the application.
 * @returns {JSX}
 */
const Pages = () =>
  <App
    locale={locale}
    reducers={reducers}
    subscriptions={subscriptions}
  >
    <Viewport>
      {process.env.NODE_ENV === 'development' &&
        <Helmet>
          <link
            href="https://fonts.googleapis.com/css?family=Roboto:400,500,700,900"
            rel="stylesheet"
          />
        </Helmet>
      }
      <Route
        path={`${INDEX_PATH}`}
        component={Page}
      />
      <Route
        path={`${PAGE_PATH}/:pageId`}
        component={Page}
      />
      <Route
        path={`${CATEGORY_PATH}`}
        component={Category}
      />
      <Route
        path={`${CATEGORY_PATH}/:categoryId?`}
        component={Category}
      />
    </Viewport>
  </App>
;

export default Pages;
