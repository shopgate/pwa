import setViewTitle from '@shopgate/pwa-common/action-creators/view/setViewTitle';
import getCategory from '@shopgate/pwa-common-commerce/category/actions/getCategory';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import { categoryWillEnter$, categoryDidEnter$ } from './streams';

/**
 * Filter subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function category(subscribe) {
  subscribe(categoryWillEnter$, ({ dispatch, action }) => {
    const { title } = action.route.state;

    if (title) dispatch(setViewTitle(title));
  });

  subscribe(categoryDidEnter$, ({ action, dispatch }) => {
    const { categoryId } = action.route.params;
    dispatch(getCategory(hex2bin(categoryId)));
  });
}
