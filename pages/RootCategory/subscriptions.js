import setTitle from '@shopgate/pwa-common/actions/view/setTitle';
import getCategory from '@shopgate/pwa-common-commerce/category/actions/getCategory';
import { rootCategoryWillEnter$ } from './streams';

/**
 * @param {Function} subscribe The subscribe function.
 */
export default function category(subscribe) {
  subscribe(rootCategoryWillEnter$, ({ action, dispatch }) => {
    dispatch(getCategory());
    const { title } = action.route.state;
    if (title) dispatch(setTitle(title));
  });
}
