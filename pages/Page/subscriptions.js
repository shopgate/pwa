import getPageConfig from '@shopgate/pwa-common/actions/page/getPageConfig';
import { pageWillEnter$ } from './streams';

/**
 * Page subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function page(subscribe) {
  subscribe(pageWillEnter$, ({ action, dispatch }) => {
    dispatch(getPageConfig(action.route.params.pageId));
  });
}
