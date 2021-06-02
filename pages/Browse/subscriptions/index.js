import fetchRootCategories from '@shopgate/pwa-common-commerce/category/actions/fetchRootCategories';
import { browsePageWillEnter$ } from '../streams';

/**
 * @param {Function} subscribe The subscribe function.
 */
export default function browse(subscribe) {
  subscribe(browsePageWillEnter$, ({ dispatch }) => {
    dispatch(fetchRootCategories());
  });
}
