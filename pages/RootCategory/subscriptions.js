import setViewTitle from '@shopgate/pwa-common/action-creators/view/setViewTitle';
import getCategory from '@shopgate/pwa-common-commerce/category/actions/getCategory';
import { rootCategoryDidEnter$ } from './streams';

/**
 * @param {Function} subscribe The subscribe function.
 */
export default function category(subscribe) {
  subscribe(rootCategoryDidEnter$, ({ dispatch, action }) => {
    const { title } = action.route.state;

    dispatch(getCategory());
    if (title) dispatch(setViewTitle(title));
  });
}
