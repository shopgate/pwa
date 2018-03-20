import { CATEGORY_PATH } from '@shopgate/pwa-common-commerce/category/constants';
import getCategory from '@shopgate/pwa-common-commerce/category/actions/getCategory';
import { getCurrentCategoryId } from '@shopgate/pwa-common-commerce/category/selectors';
import { routeDidEnter } from '@shopgate/pwa-common/streams/history';

/**
 * Filter subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function category(subscribe) {
  const categoryRouteDidEnter$ = routeDidEnter(CATEGORY_PATH);

  /**
   * Gets triggered on entering the filter route.
   */
  subscribe(categoryRouteDidEnter$, ({ dispatch, getState }) => {
    const state = getState();
    dispatch(getCategory(getCurrentCategoryId(state)));
  });
}
