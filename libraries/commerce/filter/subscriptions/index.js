import { ACTION_PUSH, ACTION_POP } from '@virtuous/conductor/constants';
import { getSearchPhrase } from '@shopgate/pwa-common/selectors/history';
import { historyDidReset$ } from '@shopgate/pwa-common/streams';
import { getCurrentCategoryId } from '../../category/selectors';
import mergeTemporaryFilters from '../action-creators/mergeTemporaryFilters';
import setFilterHash from '../action-creators/setFilterHash';
import setTemporaryFilters from '../action-creators/setTemporaryFilters';
import addActiveFilters from '../action-creators/addActiveFilters';
import setActiveFilters from '../action-creators/setActiveFilters';
import removeActiveFilters from '../action-creators/removeActiveFilters';
import resetActiveFilters from '../action-creators/resetActiveFilters';
import getFilters from '../actions/getFilters';
import { getActiveFilters, getFilterHash } from '../selectors';
import { searchWillUpdate$ } from '../../search/streams';
import {
  filterWillEnter$,
  filterWillLeave$,
  filterableRoutesWillEnter$,
  filterableRoutesWillLeave$,
} from '../streams';

/**
 * Filters subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function filters(subscribe) {
  subscribe(filterWillEnter$, ({
    dispatch,
    getState,
    prevState,
    action,
  }) => {
    if (action.historyAction === ACTION_PUSH) {
      dispatch(setTemporaryFilters(getActiveFilters(getState())));
      dispatch(setFilterHash(getFilterHash(prevState)));
    }
  });

  subscribe(filterWillLeave$, ({ dispatch, action }) => {
    if (action.historyAction === ACTION_POP) {
      dispatch(setFilterHash(''));
    }
  });

  subscribe(filterableRoutesWillEnter$, ({ dispatch, getState }) => {
    const state = getState();
    /**
     * Depending on the route there will be a search phrase or a category id. To keep the logic
     * simple both values are selected from the state. The one that doesn't belong to the route will
     * turn to null.
     */
    const categoryId = getCurrentCategoryId(state);
    const searchPhrase = getSearchPhrase(state);
    // Add a new placeholder object for active filters to the activeFilters stack
    dispatch(addActiveFilters({
      categoryId,
      searchPhrase,
    }));
  });

  subscribe(filterableRoutesWillLeave$, ({ dispatch }) => {
    dispatch(removeActiveFilters());
  });

  subscribe(filterableRoutesWillEnter$, ({ dispatch }) => {
    dispatch(mergeTemporaryFilters({}));
  });

  subscribe(searchWillUpdate$, ({ dispatch, getState }) => {
    // Reset the current activeFilters object and update the search phrase with the new one
    const searchPhrase = getSearchPhrase(getState());
    dispatch(setActiveFilters({}, { searchPhrase }));
    dispatch(getFilters());
  });

  subscribe(historyDidReset$, ({ dispatch }) => {
    dispatch(resetActiveFilters());
  });
}
