import setViewTitle from '@shopgate/pwa-common/action-creators/view/setViewTitle';
import getCategory from '@shopgate/pwa-common-commerce/category/actions/getCategory';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import { categoryWillEnter$ } from './streams';

/**
 * Filter subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function category(subscribe) {
  subscribe(categoryWillEnter$, ({ dispatch, action }) => {
    const { title } = action.route.state;
    const { categoryId } = action.route.params;

    if (title) dispatch(setViewTitle(title));
    dispatch(getCategory(hex2bin(categoryId)));
  });
}
