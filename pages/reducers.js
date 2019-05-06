import { combineReducers } from 'redux';
import persistReducers from '@shopgate/pwa-common/collections/PersistedReducers';
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
import search from '@shopgate/pwa-common-commerce/search/reducers';
import reviews from '@shopgate/pwa-common-commerce/reviews/reducers';
import extensions from 'Extensions/reducers';
import viewSwitch from 'Components/FilterBar/components/Content/components/ViewSwitch/reducer';

persistReducers.set([
  'cart',
  'client.info',
  'page',
  'url',
  'user',
]);

const reducers = combineReducers({
  router,
  cart,
  category,
  client,
  ...extensions && { extensions: combineReducers(extensions) },
  favorites,
  filter,
  menu,
  modal,
  page,
  product,
  reviews,
  search,
  ui: combineReducers({
    viewSwitch,
  }),
  url,
  user,
});

export default reducers;
