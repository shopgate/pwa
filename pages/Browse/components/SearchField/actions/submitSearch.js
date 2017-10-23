/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import pushHistory from '@shopgate/pwa-common/actions/history/pushHistory';
import { SEARCH_PATH } from '@shopgate/pwa-common-commerce/search/constants';
import { setSearchPhrase } from 'Components/Navigator/action-creators';

/**
 * Performs appropriate action(s) when UI search gets triggered.
 * @return {Function} A redux thunk.
 */
const submitSearch = () => (dispatch, getState) => {
  const state = getState();
  const { searchPhrase } = state.navigator;

  // Perform search by entering/updating search route
  const { history } = state;
  const { sort, ...otherParams } = history.queryParams;

  // Set up next history location.
  const historyLocation = {
    pathname: SEARCH_PATH,
    params: {
      ...otherParams,
      s: searchPhrase,
    },
  };

  // Clear the search phrase.
  dispatch(setSearchPhrase(''));

  // Move to the search location
  dispatch(pushHistory(historyLocation));
};

export default submitSearch;
