import { routeWillEnter$ } from '@shopgate/engage/core';
import { CATEGORY_PATH } from '@shopgate/engage/category';

/**
 * @type {Observable}
 */
export const rootCategoryWillEnter$ = routeWillEnter$
  .filter(({ action }) => action.route.pattern === CATEGORY_PATH);
