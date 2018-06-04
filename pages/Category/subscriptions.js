import setTitle from '@shopgate/pwa-common/actions/view/setTitle';
import fetchCategory from '@shopgate/pwa-common-commerce/category/actions/fetchCategory';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import { categoryWillEnter$, receivedVisibleCategory$ } from './streams';

/**
 * Filter subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function category(subscribe) {
  subscribe(categoryWillEnter$, ({ dispatch, action }) => {
    const { title } = action.route.state;

    dispatch(fetchCategory(hex2bin(action.route.params.categoryId)));

    if (title) {
      dispatch(setTitle(title));
    }
  });

  subscribe(receivedVisibleCategory$, ({ dispatch, action }) => {
    dispatch(setTitle(action.categoryData.name));
  });
}
