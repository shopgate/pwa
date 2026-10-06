import { historyPush, historyReplace } from '@shopgate/pwa-common/actions/router';
import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import { routeDidEnter$ } from '@shopgate/pwa-common/streams/router';
import { SEARCH_PATH, SEARCH_PATTERN } from '@shopgate/pwa-common-commerce/search/constants';
import openFilterRoute from '@shopgate/engage/product/components/FilterBar/components/Content/actions/openFilterRoute';

/**
 * Opens the results of a search. A search started from the results replaces them.
 * @param {string} searchPhrase The search phrase.
 * @returns {Function} A redux thunk.
 */
export const submitSearch = searchPhrase => (dispatch, getState) => {
  const { pattern } = getCurrentRoute(getState()) || {};
  const navigate = pattern === SEARCH_PATTERN ? historyReplace : historyPush;

  return dispatch(navigate({
    pathname: `${SEARCH_PATH}?s=${encodeURIComponent(searchPhrase)}`,
  }));
};

/**
 * Opens the results of a search and then its filters.
 * @param {string} searchPhrase The search phrase.
 * @returns {Function} A redux thunk.
 */
export const submitSearchWithFilters = searchPhrase => (dispatch) => {
  const subscription = routeDidEnter$.subscribe(({ action }) => {
    const { route } = action;
    if (route?.pattern !== SEARCH_PATTERN || route?.query?.s !== searchPhrase) {
      return;
    }

    subscription.unsubscribe();
    dispatch(openFilterRoute());
  });

  dispatch(submitSearch(searchPhrase));
};
