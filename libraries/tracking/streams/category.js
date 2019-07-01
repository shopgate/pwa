import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import { routeDidEnter$ } from '@shopgate/pwa-common/streams/router';
import { pwaDidAppear$ } from '@shopgate/pwa-common/streams/app';
import {
  ROOT_CATEGORY_PATTERN,
  CATEGORY_PATTERN,
} from '@shopgate/pwa-common-commerce/category/constants';
import { getProductsResult } from '@shopgate/pwa-common-commerce/product/selectors/product';
import { receivedRootCategories$ } from '@shopgate/pwa-common-commerce/category/streams';
import { getRootCategories } from '@shopgate/pwa-common-commerce/category/selectors';
import { productsReceived$ } from './product';

/**
 * Emits when the root category was entered.
 */
const rootCategoryDidEnter$ = routeDidEnter$
  .filter(({ action }) => action.route.pattern === ROOT_CATEGORY_PATTERN);

/**
 * Emits when a regular category was entered.
 */
const categoryDidEnter$ = routeDidEnter$
  .filter(({ action }) => action.route.pattern === CATEGORY_PATTERN);

/**
 * Emits when the root category data has been received.
 */
const rootCategoryLoaded$ = rootCategoryDidEnter$.switchMap(() => receivedRootCategories$);

/**
 * Emits when a root category's data is already available.
 */
const rootCategoryPreloaded$ = rootCategoryDidEnter$.filter(({ getState }) => {
  const rootCategories = getRootCategories(getState());
  return rootCategories ? !!rootCategories.length : false;
});

/**
 * Emits when a category's data is available.
 */
const categoryDataLoaded$ = categoryDidEnter$
  .switchMap((data) => {
    const { action, getState } = data;
    const { categoryId } = action.route.params;

    // Check if products for the current route are already available within Redux.
    const productsLoaded = getProductsResult(
      getState(),
      { categoryId: hex2bin(categoryId) }
    ).totalProductCount !== null;

    if (!productsLoaded) {
      // Wait for incoming products if they are not available yet.
      return productsReceived$.first();
    }

    return Observable.of(data);
  });

/**
 * Emits when the category route comes active again after a legacy page was active.
 */
const categoryRouteReappeared$ = pwaDidAppear$
  .filter(({ action }) => [CATEGORY_PATTERN, ROOT_CATEGORY_PATTERN].includes(action.route.pattern));

/**
 * Emits when a category or root category is ready to be tracked,
 * considering loaded or preloaded data.
 */
export const categoryIsReady$ = categoryDataLoaded$.merge(
  rootCategoryLoaded$,
  rootCategoryPreloaded$,
  categoryRouteReappeared$
);
