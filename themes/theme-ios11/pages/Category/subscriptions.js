import { ENOTFOUND } from '@shopgate/engage/core';
import { getCurrentRoute } from '@shopgate/engage/core';
import { historyPop } from '@shopgate/engage/core';
import { fetchCategory } from '@shopgate/engage/category';
import { fetchCategoryProducts } from '@shopgate/engage/category';
import { fetchFilters } from '@shopgate/engage/filter';
import { hex2bin } from '@shopgate/engage/core';
import { showModal } from '@shopgate/engage/core';
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
    }));
  });
}
