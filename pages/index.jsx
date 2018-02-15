/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Helmet from 'react-helmet';
import '@shopgate/pwa-common/styles/reset';
import 'Styles/fonts';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { isDev } from '@shopgate/pwa-common/helpers/environment';
import Route from '@shopgate/pwa-common/components/Router/components/Route';
import AuthRoutes from '@shopgate/pwa-common/components/Router/components/AuthRoutes';
import ModalContainer from '@shopgate/pwa-common/components/ModalContainer';
import App from '@shopgate/pwa-common/App';
import {
  INDEX_PATH,
  PAGE_PATH,
  LOGIN_PATH,
  REGISTER_PATH,
  CHECKOUT_PATH,
} from '@shopgate/pwa-common/constants/RoutePaths';
import { CATEGORY_PATH } from '@shopgate/pwa-common-commerce/category/constants';
import { FILTER_PATH } from '@shopgate/pwa-common-commerce/filter/constants';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import { SEARCH_PATH } from '@shopgate/pwa-common-commerce/search/constants';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import { ORDERS_PATH } from '@shopgate/pwa-common-commerce/orders/constants';
import { FAVORITES_PATH } from '@shopgate/pwa-common-commerce/favorites/constants';
import Viewport from 'Components/Viewport';
import Dialog from 'Components/Dialog';
import SnackBar from 'Components/SnackBar';
import locale from '../locale';
import reducers from './reducers';
import subscribers from './subscribers';
import Page from './Page';
import Category from './Category';
import Filter from './Filter';
import FilterAttribute from './FilterAttribute';
import Product from './Product';
import ProductGallery from './ProductGallery';
import Cart from './Cart';
import Favorites from './Favorites';
import Search from './Search';
import Login from './Login';
import Checkout from './Checkout';
import Orders from './Orders';
import Reviews from './Reviews';
import WriteReview from './WriteReview';

const devFontsUrl = 'https://fonts.googleapis.com/css?family=Roboto:400,400i,500,700,900';

/**
 * The theme's main component defines all the routes (views) inside the application.
 * @returns {JSX}
 */
const Pages = () => (
  <App locale={locale} reducers={reducers} subscribers={subscribers}>
    <Viewport>
      <ModalContainer component={Dialog} />
      <SnackBar />
      <Route path={`${INDEX_PATH}`} component={Page} />
      <Route path={`${PAGE_PATH}/:pageId`} component={Page} />
      <Route path={`${CATEGORY_PATH}`} component={Category} />
      <Route path={`${CATEGORY_PATH}/:categoryId?/:selection?`} component={Category} />
      <Route path={`${FILTER_PATH}`} component={Filter} />
      <Route path={`${FILTER_PATH}/:attribute`} component={FilterAttribute} />
      <Route path={`${ITEM_PATH}/:productId`} component={Product} />
      <Route path={`${ITEM_PATH}/:productId/gallery/:initialSlide?`} component={ProductGallery} />
      <Route path={`${ITEM_PATH}/:productId/reviews/`} component={Reviews} />
      <Route path={`${CART_PATH}`} component={Cart} />
      {
        appConfig.hasFavorites
        && <Route path={`${FAVORITES_PATH}`} component={Favorites} />
      }
      <Route path={`${SEARCH_PATH}`} component={Search} />
      <Route path={`${LOGIN_PATH}`} component={Login} />
      <Route path={`${REGISTER_PATH}`} />

      <AuthRoutes to={`${LOGIN_PATH}`}>
        <Route path={`${CHECKOUT_PATH}`} component={Checkout} />
        <Route path={`${ORDERS_PATH}`} component={Orders} />
        <Route path={`${ITEM_PATH}/:productId/write_review/`} component={WriteReview} />
      </AuthRoutes>

      {isDev && (
        <Helmet>
          <link href={devFontsUrl} rel="stylesheet" />
        </Helmet>
      )}
    </Viewport>
  </App>
);

export default Pages;
