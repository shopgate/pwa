import { PAGE_ID_INDEX } from '@shopgate/pwa-common/constants/PageIDs';
import { fetchPageConfig } from '@shopgate/pwa-common/actions/page';
import { startPageWillEnter$ } from './streams';

let force = true;

/**
 * Page subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function page(subscribe) {
  subscribe(startPageWillEnter$, ({ dispatch }) => {
    dispatch(fetchPageConfig(PAGE_ID_INDEX, force));
    force = false;
  });
}
