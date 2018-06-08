import { searchWillEnter$, searchWillLeave$ } from '@shopgate/pwa-common-commerce/search/streams';
import setTitle from '@shopgate/pwa-common/actions/view/setTitle';
import toggleProgressBar from '../../components/Navigator/actions/toggleProgressBar';
import getSearchResults from '@shopgate/pwa-common-commerce/search/actions/getSearchResults';

/**
 * Filter subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function search(subscribe) {
  subscribe(searchWillEnter$, ({ action, dispatch }) => {
    const { searchPhrase } = action.route.params;
    dispatch(getSearchResults(searchPhrase));
    dispatch(setTitle(searchPhrase));
    dispatch(toggleProgressBar(false));
  });

  subscribe(searchWillLeave$, ({ dispatch }) => {
    dispatch(toggleProgressBar(true));
  });
}
