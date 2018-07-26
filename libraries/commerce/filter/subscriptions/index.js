import { getSearchPhrase } from '@shopgate/pwa-common/selectors/history';
import getFilters from '../actions/getFilters';
import { getCurrentCategoryId } from '../../category/selectors';
import mergeTemporaryFilters from '../action-creators/mergeTemporaryFilters';
import setFilterHash from '../action-creators/setFilterHash';
import setTemporaryFilters from '../action-creators/setTemporaryFilters';
import addActiveFilters from '../action-creators/addActiveFilters';
import setActiveFilters from '../action-creators/setActiveFilters';
import removeActiveFilters from '../action-creators/removeActiveFilters';
import resetActiveFilters from '../action-creators/resetActiveFilters';
import { getActiveFilters, getFilterHash } from '../selectors';
import {
  historyWillReset$,
  filterRouteDidEnter$,
  filterRouteDidLeave$,
  filterableRoutesDidEnter$,
  filterableRoutesDidLeave$,
  searchRouteWasUpdated$,
  newFilterableRoutesEntered$,
} from '../streams';

/**
 * Filters subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function filters(subscribe) {
  subscribe(filterRouteDidLeave$, ({ dispatch }) => {
    dispatch(setFilterHash(''));
  });

  subscribe(filterRouteDidEnter$, ({ dispatch, getState, prevState }) => {
    dispatch(setTemporaryFilters(getActiveFilters(getState())));
    dispatch(setFilterHash(getFilterHash(prevState)));
  });

  subscribe(newFilterableRoutesEntered$, ({ dispatch }) => {
    dispatch(mergeTemporaryFilters({}));
  });

  subscribe(filterableRoutesDidEnter$, ({ dispatch, getState }) => {
    /**
     * Depending on the route there will be a search phrase or a category id. To keep the logic
     * simple both values are selected from the state. The one that doesn't belong to the route will
     * turn to null.
     */
    const categoryId = getCurrentCategoryId(getState());
    const searchPhrase = getSearchPhrase(getState());
    // Add a new placeholder object for active filters to the activeFilters stack
    dispatch(addActiveFilters({
      categoryId,
      searchPhrase,
    }));
  });

  subscribe(searchRouteWasUpdated$, ({ dispatch, getState }) => {
    // Reset the current activeFilters object and update the search phrase with the new one
    const searchPhrase = getSearchPhrase(getState());
    dispatch(setActiveFilters({}, { searchPhrase }));
    dispatch(getFilters());
  });

  subscribe(filterableRoutesDidLeave$, ({ dispatch }) => {
    // Remove the last activeFilters object from the stack
    dispatch(removeActiveFilters());
  });

  subscribe(historyWillReset$, ({ dispatch }) => {
    dispatch(resetActiveFilters());
  });
}
