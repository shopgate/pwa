import { routeDidEnter$ } from '@shopgate/pwa-common/streams/router';
import { CATEGORY_PATH } from '@shopgate/pwa-common-commerce/category/constants';

/**
 * @type {Observable}
 */
export const rootCategoryDidEnter$ = routeDidEnter$
  .filter(({ action }) => action.route.pathname === CATEGORY_PATH);
