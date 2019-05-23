import { fetchRootCategories } from '@shopgate/engage/category';
import { browsePageWillEnter$ } from '../streams';

/**
 * @param {Function} subscribe The subscribe function.
 */
export default function browse(subscribe) {
  subscribe(browsePageWillEnter$, ({ dispatch }) => {
    dispatch(fetchRootCategories());
  });
}
