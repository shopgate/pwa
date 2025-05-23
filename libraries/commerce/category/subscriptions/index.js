import { ACTION_PUSH, ACTION_REPLACE } from '@virtuous/conductor';
import { buildFetchCategoryProductsParams, getProductsResult } from '@shopgate/engage/product';
import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import { historyPop } from '@shopgate/pwa-common/actions/router';
import expireProductsByHash from '@shopgate/pwa-common-commerce/product/action-creators/expireProductsByHash';
import fetchCategory from '@shopgate/pwa-common-commerce/category/actions/fetchCategory';
import fetchCategoryProducts from '@shopgate/pwa-common-commerce/category/actions/fetchCategoryProducts';
import fetchFilters from '@shopgate/pwa-common-commerce/filter/actions/fetchFilters';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import { categoryProductsNeedUpdate$ } from '@shopgate/engage/category/streams';
import {
  categoryWillEnter$,
  categoryDidEnter$,
  errorVisibleCategory$,
  categoryFiltersDidUpdateFromFilterPage$,
} from '../streams';

/**
 * Category subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function category(subscribe) {
  subscribe(categoryWillEnter$, ({ dispatch, action, getState }) => {
    if (![ACTION_PUSH, ACTION_REPLACE].includes(action?.historyAction)) {
      return;
    }

    const { filters, offset = 0 } = action.route.state;
    const categoryId = hex2bin(action.route.params.categoryId);

    const { hash, expired } = getProductsResult(getState(), {
      categoryId,
      routeId: action?.route?.id,
      ...buildFetchCategoryProductsParams(),
    });

    if (expired) {
      dispatch(expireProductsByHash(hash));
    }

    dispatch(fetchCategory(categoryId));
    dispatch(fetchCategoryProducts({
      categoryId,
      filters,
      offset,
      ...buildFetchCategoryProductsParams(),
    }));
  });

  subscribe(categoryDidEnter$, ({ dispatch }) => {
    dispatch(fetchFilters());
  });

  /**
   * Gets triggered on pipeline category error.
   */
  subscribe(errorVisibleCategory$, ({ dispatch }) => {
    dispatch(historyPop());
  });

  subscribe(categoryProductsNeedUpdate$, ({ dispatch, getState }) => {
    const { params, state: { offset = 0, filters } } = getCurrentRoute(getState());
    const categoryId = hex2bin(params.categoryId);

    dispatch(fetchCategoryProducts({
      categoryId,
      filters,
      offset,
      ...buildFetchCategoryProductsParams(),
    }));
  });

  subscribe(categoryFiltersDidUpdateFromFilterPage$, ({ dispatch, action }) => {
    const categoryId = hex2bin(action.route.params.categoryId);
    const { filters, offset = 0 } = action.route.state;
    dispatch(fetchCategoryProducts({
      categoryId,
      filters,
      offset,
      ...buildFetchCategoryProductsParams(),
    }));
  });
}
