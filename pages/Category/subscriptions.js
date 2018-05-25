import getCategory from '@shopgate/pwa-common-commerce/category/actions/getCategory';
import { categoryDidEnter$ } from './streams';

/**
 * Filter subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function category(subscribe) {
  subscribe(categoryDidEnter$, ({ action, dispatch }) => {
    const { categoryId } = action.route.params;
    dispatch(getCategory(categoryId));
  });
}
