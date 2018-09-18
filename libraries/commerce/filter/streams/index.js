import { main$ } from '@shopgate/pwa-common/streams/main';
import {
  routeDidEnter,
  routeDidLeave,
  historyDidUpdate$,
} from '@shopgate/pwa-common/streams/history';
import {
  HISTORY_POP_ACTION,
  HISTORY_PUSH_ACTION,
  HISTORY_REPLACE_ACTION,
  HISTORY_WILL_RESET,
} from '@shopgate/pwa-common/constants/ActionTypes';
import {
  getHistoryPathname,
  getHistoryAction,
  getSearchPhrase,
} from '@shopgate/pwa-common/selectors/history';
import { FILTER_PATH } from '../constants';
import { CATEGORY_PATH } from '../../category/constants';
import { SEARCH_PATH } from '../../search/constants';

/**
 * Gets triggered when the history will reset.
 * In that case the activeFilters stack also needs to be reset.
 */
export const historyWillReset$ = main$
  .filter(({ action }) => action.type === HISTORY_WILL_RESET);

/**
 * Gets triggered when entering the filter route.
 */
export const filterRouteDidEnter$ = routeDidEnter(FILTER_PATH);

/**
 * Gets triggered when leaving the filter route.
 */
export const filterRouteDidLeave$ = routeDidLeave(FILTER_PATH);

/**
 * Gets triggered when entering a filterable route by going forward in, or replacing the history.
 */
export const filterableRoutesDidEnter$ = routeDidEnter(CATEGORY_PATH)
  .merge(routeDidEnter(SEARCH_PATH))
  .filter(({ historyAction, initialEnter }) => (
    historyAction === HISTORY_PUSH_ACTION || initialEnter === true
  ));

/**
 * Gets triggered when leaving a filterable route by going back in history.
 */
export const filterableRoutesDidLeave$ = routeDidLeave(CATEGORY_PATH)
  .merge(routeDidLeave(SEARCH_PATH))
  .filter(({ historyAction }) => historyAction === HISTORY_POP_ACTION);

/**
 * Gets triggered when the search route is switched by replacing the history entry and the
 * search phrase changed.
 */
export const searchRouteWasUpdated$ = historyDidUpdate$
  .filter((input) => {
    const state = input.getState();
    const historyAction = getHistoryAction(state);

    // Check for the right history action
    if (historyAction === HISTORY_REPLACE_ACTION) {
      const pathName = getHistoryPathname(state);
      const prevPathName = getHistoryPathname(input.prevState);

      // Check if the transition happened between two search routes
      if (prevPathName.startsWith(SEARCH_PATH) && pathName.startsWith(SEARCH_PATH)) {
        const searchPhrase = getSearchPhrase(state);
        const prevSearchPhrase = getSearchPhrase(input.prevState);

        // Check if the search phrase changed
        return prevSearchPhrase !== searchPhrase;
      }
    }

    return false;
  });

/**
 * Gets triggered when entering a filterable route NOT coming from filters.
 */
export const newFilterableRoutesEntered$ = filterableRoutesDidEnter$.filter(({ prevPathname }) => (
  !prevPathname.startsWith(FILTER_PATH)
));
