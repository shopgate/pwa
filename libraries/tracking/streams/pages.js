import { routeDidEnter$ } from '@shopgate/pwa-common/streams/router';
import {
  SEARCH_PATH,
  SEARCH_FILTER_PATTERN,
} from '@shopgate/pwa-common-commerce/search/constants';
import {
  ROOT_CATEGORY_PATTERN,
  CATEGORY_PATTERN,
  CATEGORY_FILTER_PATTERN,
} from '@shopgate/pwa-common-commerce/category/constants';
import {
  ITEM_PATTERN,
  ITEM_GALLERY_PATTERN,
  ITEM_REVIEWS_PATTERN,
  ITEM_WRITE_REVIEW_PATTERN,
} from '@shopgate/pwa-common-commerce/product/constants';
import { FAVORITES_PATH } from '@shopgate/pwa-common-commerce/favorites/constants';
import { pwaDidAppear$ } from './app';
import { isPWAVisible } from '../helpers';

/**
 * A blacklist of paths that should be tracked whithin their individual subscriptions.
 * @type {Array}
 */
export const blacklistedPatterns = [
  ROOT_CATEGORY_PATTERN,
  CATEGORY_PATTERN,
  ITEM_PATTERN,
  FAVORITES_PATH,
  SEARCH_PATH,
  // Patterns for routes which are not supported for tracking at the moment.
  CATEGORY_FILTER_PATTERN,
  SEARCH_FILTER_PATTERN,
  ITEM_GALLERY_PATTERN,
  ITEM_REVIEWS_PATTERN,
  ITEM_WRITE_REVIEW_PATTERN,
];

/**
 * Emits when one of the tracked paths is entered except some special one.
 */
export const pagesAreReady$ = routeDidEnter$
  .filter(() => isPWAVisible())
  .merge(pwaDidAppear$)
  .filter(({ action }) => !blacklistedPatterns.find(pattern => action.route.pattern === pattern));
