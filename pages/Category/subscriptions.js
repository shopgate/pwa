import getCurrentRoute from '@virtuous/conductor-helpers/getCurrentRoute';
import { getActiveFilters } from '@shopgate/pwa-common-commerce/filter/selectors';
import { historyPop } from '@shopgate/pwa-common/actions/router';
import setTitle from '@shopgate/pwa-common/actions/view/setTitle';
import fetchCategory from '@shopgate/pwa-common-commerce/category/actions/fetchCategory';
import fetchCategoryProducts from '@shopgate/pwa-common-commerce/category/actions/fetchCategoryProducts';
import { getCategoryName } from '@shopgate/pwa-common-commerce/category/selectors';
import getFilters from '@shopgate/pwa-common-commerce/filter/actions/getFilters';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import { categoryError$ } from '@shopgate/pwa-common-commerce/category/streams';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import {
  categoryWillEnter$,
  categoryDidEnter$,
  receivedVisibleCategory$,
  categoryFiltersDidUpdate$,
} from './streams';

/**
 * Category subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function category(subscribe) {
  subscribe(categoryWillEnter$, ({ dispatch, action, getState }) => {
    let { title } = action.route.state;
    const filters = getActiveFilters();
    const categoryId = hex2bin(action.route.params.categoryId);

    dispatch(fetchCategory(categoryId));
    dispatch(fetchCategoryProducts({
      categoryId, filters,
    }));

    // If a title didn't come in then try to lookup the category and grab its name.
    if (!title) {
      title = getCategoryName(getState());
    }

    if (title) {
      dispatch(setTitle(title));
    }
  });

  subscribe(categoryDidEnter$, ({ dispatch }) => {
    dispatch(getFilters());
  });

  subscribe(receivedVisibleCategory$, ({ dispatch, action }) => {
    dispatch(setTitle(action.categoryData.name));
  });

  /**
   * Gets triggered on pipeline category error.
   */
  subscribe(categoryError$, ({ action, dispatch }) => {
    const { errorCode } = action;
    let message = 'modal.body_error';

    if (errorCode === 'ENOTFOUND') {
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

  subscribe(categoryFiltersDidUpdate$, ({ dispatch }) => {
    const { params } = getCurrentRoute();
    const categoryId = hex2bin(params.categoryId);
    const filters = getActiveFilters();

    dispatch(fetchCategoryProducts({
      categoryId, filters,
    }));
  });
}
