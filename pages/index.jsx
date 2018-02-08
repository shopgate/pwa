/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import '@shopgate/pwa-common/styles/reset';
import 'Styles/fonts';
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
import { BROWSE_PATH } from 'Pages/Browse/constants';
import { MORE_PATH } from 'Pages/More/constants';
import Portal from '@shopgate/pwa-common/components/Portal';
import { APP_ROUTES } from '@shopgate/pwa-common/constants/Portals';
import Viewport from 'Components/Viewport';
import Dialog from 'Components/Dialog';
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
import Search from './Search';
import Login from './Login';
import Checkout from './Checkout';
import Orders from './Orders';
import Reviews from './Reviews';
import More from './More';
import Browse from './Browse';
import WriteReview from './WriteReview';

/**
 * The theme's main component defines all the routes (views) inside the application.
 * @returns {JSX}
 */
const Pages = () => (
  <App locale={locale} reducers={reducers} subscribers={subscribers}>
    <Viewport>
      <ModalContainer component={Dialog} />

      <Route path={`${INDEX_PATH}`} component={Page} />
      <Route path={`${PAGE_PATH}/:pageId`} component={Page} />
      <Route path={`${CATEGORY_PATH}`} component={Category} />
      <Route path={`${CATEGORY_PATH}/:categoryId?`} component={Category} />
      <Route path={`${FILTER_PATH}`} component={Filter} />
      <Route path={`${FILTER_PATH}/:attribute`} component={FilterAttribute} />
      <Route path={`${ITEM_PATH}/:productId`} component={Product} />
      <Route path={`${ITEM_PATH}/:productId/gallery/:initialSlide?`} component={ProductGallery} />
      <Route path={`${ITEM_PATH}/:productId/reviews/`} component={Reviews} />
      <Route path={`${CART_PATH}`} component={Cart} />
      <Route path={`${SEARCH_PATH}`} component={Search} />
      <Route path={`${LOGIN_PATH}`} component={Login} />
      <Route path={`${REGISTER_PATH}`} />
      <Route path={`${MORE_PATH}`} component={More} />
      <Route path={`${BROWSE_PATH}`} component={Browse} />

      <Portal name={APP_ROUTES} />

      <AuthRoutes to={`${LOGIN_PATH}`}>
        <Route path={`${CHECKOUT_PATH}`} component={Checkout} />
        <Route path={`${ORDERS_PATH}`} component={Orders} />
        <Route path={`${ITEM_PATH}/:productId/write_review/`} component={WriteReview} />
      </AuthRoutes>
    </Viewport>
  </App>
);

export default Pages;
