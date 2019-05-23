import { fetchRootCategories } from '@shopgate/engage/category';
import { rootCategoryWillEnter$ } from '../streams';

/**
 * @param {Function} subscribe The subscribe function.
 */
export default function category(subscribe) {
  subscribe(rootCategoryWillEnter$, ({ dispatch }) => {
    dispatch(fetchRootCategories());
  });
}
