import { fetchPageConfig } from '@shopgate/pwa-common/actions/page';
import { getPageConfigById } from '@shopgate/pwa-common/selectors/page';
import { PAGE_ID_INDEX } from '@shopgate/pwa-common/constants/PageIDs';
import expireProductsByHash from '@shopgate/pwa-common-commerce/product/action-creators/expireProductsByHash';
import { pageWillEnter$, clearExpiredProducts$ } from './streams';
import { getProductsResult } from '../../widgets/selectors';

/**
 * Page subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function page(subscribe) {
  subscribe(pageWillEnter$, ({ action, dispatch }) => {
    dispatch(fetchPageConfig(action.route.params.pageId));
  });

  subscribe(clearExpiredProducts$, ({ action, dispatch, getState }) => {
    const state = getState();

    const pageData = getPageConfigById(
      state,
      { pageId: action.route.params.pageId || PAGE_ID_INDEX }
    );

    if (pageData?.widgets) {
      pageData.widgets.forEach(({ id, settings }) => {
        const { queryType, sortOrder: sort, queryParams: value } = settings;

        if (!queryType) {
          return;
        }

        const { hash, expired } = getProductsResult(state, queryType, { sort, value }, id);

        if (expired) {
          dispatch(expireProductsByHash(hash));
        }
      });
    }
  });
}
