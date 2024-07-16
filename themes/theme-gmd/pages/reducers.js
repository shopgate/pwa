import { combineReducers } from 'redux';
import {
  persistedReducers,
  configuration,
  RESET_APP_REDUCERS,
  hasWebBridge,
} from '@shopgate/engage/core';
import backInStock from '@shopgate/engage/back-in-stock/reducers';
import checkout from '@shopgate/engage/checkout/reducers';
import client from '@shopgate/pwa-common/reducers/client';
import url from '@shopgate/pwa-common/reducers/url';
import user from '@shopgate/pwa-common/reducers/user';
import page from '@shopgate/pwa-common/reducers/page';
import router from '@shopgate/pwa-common/reducers/router';
import menu from '@shopgate/pwa-common/reducers/menu';
import modal from '@shopgate/pwa-common/reducers/modal';
import cart from '@shopgate/pwa-common-commerce/cart/reducers';
import pushOptIn from '@shopgate/engage/push-opt-in/reducers';
import category from '@shopgate/pwa-common-commerce/category/reducers';
import favorites from '@shopgate/pwa-common-commerce/favorites/reducers';
import filter from '@shopgate/pwa-common-commerce/filter/reducers';
import product from '@shopgate/pwa-common-commerce/product/reducers';
import { settings } from '@shopgate/engage/core/reducers';
import locations from '@shopgate/engage/locations/reducers';
import orders from '@shopgate/engage/orders/reducers';
import search from '@shopgate/pwa-common-commerce/search/reducers';
import reviews from '@shopgate/pwa-common-commerce/reviews/reducers';
import account from '@shopgate/engage/account/reducers';
import appRating from '@shopgate/engage/app-rating/reducers';
import extensions from 'Extensions/reducers';

persistedReducers.set([
  'cart.data',
  'client.info',
  'page',
  'locations.storage',
  'locations.userFormInput',
  'locations.userSearch',
  'url',
  'user',
  'appRating',
  'pushOptIn.optInTrigger',
  ...(hasWebBridge() ? 'menu' : []),
]);

configuration.set(RESET_APP_REDUCERS, [
  'cart',
  'category',
  'product',
  'favorites',
  'filter',
  'reviews',
  'search',
]);

const reducers = combineReducers({
  account,
  router,
  cart,
  category,
  backInStock,
  checkout,
  client,
  ...extensions && { extensions: combineReducers(extensions) },
  favorites,
  filter,
  menu,
  modal,
  page,
  product,
  locations,
  orders,
  settings,
  reviews,
  search,
  url,
  user,
  appRating,
  pushOptIn,
});

export default reducers;
