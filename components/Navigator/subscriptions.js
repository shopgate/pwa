import { searchDidEnter$ } from '@shopgate/pwa-common-commerce/search/streams';
import { cartDidEnter$, cartDidLeave$ } from '@shopgate/pwa-common-commerce/cart/streams';
import { filterDidEnter$, filterDidLeave$ } from '@shopgate/pwa-common-commerce/filter/streams';
import { routeDidChange$ } from '@shopgate/pwa-common/streams';
import { getSearchPhrase } from '@shopgate/pwa-common/selectors/history';
import toggleNavSearchField from 'Components/Navigator/actions/toggleNavSearchField';
import { setSearchPhrase } from './action-creators';
import enableNavigatorSearch from './actions/enableNavigatorSearch';
import disableNavigatorSearch from './actions/disableNavigatorSearch';
import toggleCartIcon from './actions/toggleCartIcon';

// Derived streams.
export const cartFilterRoutesDidEnter$ = cartDidEnter$.merge(filterDidEnter$);
export const cartFilterRoutesDidLeave$ = cartDidLeave$.merge(filterDidLeave$);

/**
 * Navigator subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function navigator(subscribe) {
  /**
   * Gets triggered on all route changes.
   */
  subscribe(routeDidChange$, ({ dispatch }) => {
    dispatch(toggleNavSearchField(false));
  });

  /**
   * Gets triggered on entering the search route.
   */
  subscribe(searchDidEnter$, ({ dispatch, getState }) => {
    const state = getState();

    // If search input is empty, set it to the value of the search query param.
    if (!state.navigator.searchPhrase) {
      dispatch(setSearchPhrase(getSearchPhrase(state)));
    }
  });

  /**
   * Gets triggered when leaving the cart or filter route.
   */
  subscribe(cartFilterRoutesDidLeave$, ({ dispatch }) => {
    dispatch(toggleCartIcon(true));
    dispatch(enableNavigatorSearch());
  });

  /**
   * Gets triggered when entering the cart or filter route.
   */
  subscribe(cartFilterRoutesDidEnter$, ({ dispatch }) => {
    dispatch(toggleCartIcon(false));
    dispatch(disableNavigatorSearch());
  });
}
