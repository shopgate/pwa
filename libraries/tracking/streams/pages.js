import { routeDidEnter$ } from '@shopgate/pwa-common/streams/router';
import { SEARCH_PATH } from '@shopgate/pwa-common-commerce/search/constants';
import { CATEGORY_PATH } from '@shopgate/pwa-common-commerce/category/constants';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import { CHECKOUT_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import { FAVORITES_PATH } from '@shopgate/pwa-common-commerce/favorites/constants';
import { pwaDidAppear$ } from './app';
import { isPWAVisible } from '../helpers';

/**
 * A blacklist of paths that should be tracked whithin their individual subscriptions.
 * @type {Array}
 */
export const blacklistedPaths = [
  SEARCH_PATH,
  CATEGORY_PATH,
  ITEM_PATH,
  CHECKOUT_PATH,
  FAVORITES_PATH,
];

/**
 * Emits when one of the tracked paths is entered except some special one.
 */
export const pagesAreReady$ = routeDidEnter$
  .filter(() => isPWAVisible())
  .merge(pwaDidAppear$)
  .filter(({ action }) => {
    const { pathname } = action.route;
    return !blacklistedPaths.some(path => (!pathname ? false : pathname.startsWith(path)));
  });
