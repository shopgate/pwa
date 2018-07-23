import getCategory from '@shopgate/pwa-common-commerce/category/actions/getCategory';
import { getCurrentCategoryId } from '@shopgate/pwa-common-commerce/category/selectors';
import {
  categoryRouteDidEnter$,
  categoryError$,
} from '@shopgate/pwa-common-commerce/category/streams';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import goBackHistory from '@shopgate/pwa-common/actions/history/goBackHistory';

/**
 * Filter subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function category(subscribe) {
  /**
   * Gets triggered on entering the filter route.
   */
  subscribe(categoryRouteDidEnter$, ({ dispatch, getState }) => {
    const state = getState();
    dispatch(getCategory(getCurrentCategoryId(state)));
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
    dispatch(goBackHistory(1));
  });
}
