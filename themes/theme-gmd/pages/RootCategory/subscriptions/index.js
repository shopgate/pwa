import fetchRootCategories from '@shopgate/pwa-common-commerce/category/actions/fetchRootCategories';
import { rootCategoryWillEnter$ } from '../streams';

/**
 * @param {Function} subscribe The subscribe function.
 */
export default function category(subscribe) {
  subscribe(rootCategoryWillEnter$, ({ dispatch }) => {
    dispatch(fetchRootCategories());
  });
}
