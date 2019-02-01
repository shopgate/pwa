import { fetchPageConfig } from '@shopgate/pwa-common/actions/page';
import { pageWillEnter$ } from './streams';

/**
 * Page subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function page(subscribe) {
  subscribe(pageWillEnter$, ({ action, dispatch }) => {
    dispatch(fetchPageConfig(action.route.params.pageId));
  });
}
