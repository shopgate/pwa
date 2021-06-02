import { buildFetchCategoryProductsParams } from '@shopgate/engage/product';
import { ENOTFOUND } from '@shopgate/pwa-core/constants/Pipeline';
import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import { historyPop } from '@shopgate/pwa-common/actions/router';
import fetchCategory from '@shopgate/pwa-common-commerce/category/actions/fetchCategory';
import fetchCategoryProducts from '@shopgate/pwa-common-commerce/category/actions/fetchCategoryProducts';
import fetchFilters from '@shopgate/pwa-common-commerce/filter/actions/fetchFilters';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import {
  categoryWillEnter$,
  categoryDidEnter$,
  categoryFiltersDidUpdate$,
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
  subscribe(errorVisibleCategory$, ({ action, dispatch }) => {
    const { errorCode } = action;
    let message = 'modal.body_error';

    if (errorCode === ENOTFOUND) {
      message = 'category.error.not_found';
    }

    dispatch(showModal({
      confirm: 'modal.ok',
      dismiss: null,
      message,
      title: 'category.error.title',
    }));
    dispatch(historyPop());
  });

  subscribe(categoryFiltersDidUpdate$, ({ action, dispatch, getState }) => {
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
