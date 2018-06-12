import setTitle from '@shopgate/pwa-common/actions/view/setTitle';
import getPageConfig from '@shopgate/pwa-common/actions/page/getPageConfig';
import { pageWillEnter$, receivedVisiblePageConfig$ } from './streams';

/**
 * Page subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function page(subscribe) {
  subscribe(pageWillEnter$, ({ action, dispatch }) => {
    dispatch(getPageConfig(action.route.params.pageId));
  });

  subscribe(receivedVisiblePageConfig$, ({ action, dispatch }) => {
    if (action.config.title) {
      dispatch(setTitle(action.config.title));
    }
  });
}
