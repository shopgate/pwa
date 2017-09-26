/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { SEARCH_PATH } from '@shopgate/pwa-common-commerce/search/constants';
import { getSearchPhrase } from '@shopgate/pwa-common/selectors/history';
import { pushHistory } from '@shopgate/pwa-common/actions/history/changeHistory';
import { replaceHistory } from '@shopgate/pwa-common/actions/history/changeHistory';
import { setSearchPhrase } from '../action-creators';
import toggleNavSearchField from './toggleNavSearchField';

 /**
  * Performs appropriate action(s) when UI search gets triggered.
  * @return {Function} A redux thunk.
  */
const submitSearch = () => (dispatch, getState) => {
  const state = getState();
  const { searchActive, searchPhrase } = state.navigator;

  if (!searchActive) {
    // Reset search phrase
    dispatch(setSearchPhrase(''));
    // Show search input
    dispatch(toggleNavSearchField(true));
    return;
  } else if (!searchPhrase) {
    // Hide search input
    dispatch(toggleNavSearchField(false));
    return;
  }

  // Perform search by entering/updating search route
  const { history } = state;
  const { sort, ...otherParams } = history.queryParams;
  const prevSearchPhrase = getSearchPhrase(state);

  // Set up next history location.
  const historyLocation = {
    pathname: SEARCH_PATH,
    params: {
      ...otherParams,
      s: searchPhrase,
    },
    state: {
      // Force view to scroll back to top
      viewTop: true,
    },
  };

  // Check if we are already on the search route
  if (history.pathname.startsWith(SEARCH_PATH)) {
    if (searchPhrase !== prevSearchPhrase) {
      // Preserve current history state
      historyLocation.state = {
        ...history.state,
        ...historyLocation.state,
      };
      // Just update the current history location
      dispatch(replaceHistory(historyLocation));
    }
  } else {
    // Move to the search location
    dispatch(pushHistory(historyLocation));
  }

  // Always close search upon submit
  dispatch(toggleNavSearchField(false));
};

export default submitSearch;
