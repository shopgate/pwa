import { PAGE_ID_INDEX } from '@shopgate/pwa-common/constants/PageIDs';
import getPageConfig from '@shopgate/pwa-common/actions/page/getPageConfig';
import * as pageStreams from './streams';

/**
 * Page subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function page(subscribe) {
  subscribe(pageStreams.pageDidEnter$, ({ action, dispatch }) => {
    const pageId = action.route.params.pageId || PAGE_ID_INDEX;

    dispatch(getPageConfig(pageId));
  });
}
