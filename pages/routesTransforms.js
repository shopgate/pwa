import { i18n, INDEX_PATH } from '@shopgate/engage/core';
import { ROOT_CATEGORY_PATTERN } from '@shopgate/pwa-common-commerce/category/constants';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import { FAVORITES_PATH } from '@shopgate/pwa-common-commerce/favorites/constants';
import { SEARCH_FILTER_PATTERN, SEARCH_PATTERN } from '@shopgate/pwa-common-commerce/search/constants';

export const routesTransforms = {
  [INDEX_PATH]: route => ({
    ...route,
    state: {
      ...route.state,
      title: i18n.text('navigation.home'),
    },
  }),
  [ROOT_CATEGORY_PATTERN]: route => ({
    ...route,
    state: {
      ...route.state,
      title: i18n.text('titles.categories'),
    },
  }),
  [CART_PATH]: route => ({
    ...route,
    state: {
      ...route.state,
      title: i18n.text('titles.cart'),
    },
  }),
  [FAVORITES_PATH]: route => ({
    ...route,
    state: {
      ...route.state,
      title: i18n.text('titles.favorites'),
    },
  }),
  [SEARCH_PATTERN]: route => ({
    ...route,
    state: {
      ...route.state,
      title: i18n.text('search.placeholder'),
    },
  }),
  [SEARCH_FILTER_PATTERN]: route => ({
    ...route,
    state: {
      ...route.state,
      title: i18n.text('search.placeholder'),
    },
  }),
};
