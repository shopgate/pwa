import { buildFetchCategoryProductsParams } from '@shopgate/engage/product';
import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import { historyPop } from '@shopgate/pwa-common/actions/router';
import fetchCategory from '@shopgate/pwa-common-commerce/category/actions/fetchCategory';
import fetchCategoryProducts from '@shopgate/pwa-common-commerce/category/actions/fetchCategoryProducts';
import fetchFilters from '@shopgate/pwa-common-commerce/filter/actions/fetchFilters';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import {
  categoryWillEnter$,
  categoryDidEnter$,
  categoryProductsNeedUpdate$,
  errorVisibleCategory$,
} from './streams';

/**
 * Category subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function category(subscribe) {
  subscribe(categoryWillEnter$, ({ dispatch, action }) => {
    const { filters, offset = 0 } = action.route.state;
    const categoryId = hex2bin(action.route.params.categoryId);

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

  subscribe(categoryProductsNeedUpdate$, ({ action, dispatch, getState }) => {
    const { params, state: { offset = 0 } } = getCurrentRoute(getState());
    const categoryId = hex2bin(params.categoryId);
    const { filters } = action;

    dispatch(fetchCategoryProducts({
      categoryId,
      filters,
      offset,
      ...buildFetchCategoryProductsParams(),
    }));
  });
}
