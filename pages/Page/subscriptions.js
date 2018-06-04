import { PAGE_ID_INDEX } from '@shopgate/pwa-common/constants/PageIDs';
import getPageConfig from '@shopgate/pwa-common/actions/page/getPageConfig';
import { pageWillEnter$ } from './streams';

/**
 * Page subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function page(subscribe) {
  subscribe(pageWillEnter$, ({ action, dispatch }) => {
    const pageId = action.route.params.pageId || PAGE_ID_INDEX;

    dispatch(getPageConfig(pageId));
  });
}
