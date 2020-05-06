import { combineReducers } from 'redux';
import {
  persistedReducers,
  configuration,
  RESET_APP_REDUCERS,
  hasWebBridge,
} from '@shopgate/engage/core';
import checkout from '@shopgate/engage/checkout/reducers';
import client from '@shopgate/pwa-common/reducers/client';
import url from '@shopgate/pwa-common/reducers/url';
import user from '@shopgate/pwa-common/reducers/user';
import page from '@shopgate/pwa-common/reducers/page';
import router from '@shopgate/pwa-common/reducers/router';
import menu from '@shopgate/pwa-common/reducers/menu';
import modal from '@shopgate/pwa-common/reducers/modal';
import cart from '@shopgate/pwa-common-commerce/cart/reducers';
import category from '@shopgate/pwa-common-commerce/category/reducers';
import favorites from '@shopgate/pwa-common-commerce/favorites/reducers';
import filter from '@shopgate/pwa-common-commerce/filter/reducers';
import product from '@shopgate/pwa-common-commerce/product/reducers';
import locations from '@shopgate/engage/locations/reducers';
import { reducers as config } from '@shopgate/engage/core/config';
import search from '@shopgate/pwa-common-commerce/search/reducers';
import reviews from '@shopgate/pwa-common-commerce/reviews/reducers';
import extensions from 'Extensions/reducers';

persistedReducers.set([
  'cart',
  'client.info',
  'page',
  'locations',
  'url',
  'user',
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
  router,
  cart,
  category,
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
  config,
  reviews,
  search,
  url,
  user,
});

export default reducers;
