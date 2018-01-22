/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import pushHistory from '@shopgate/pwa-common/actions/history/pushHistory';
import { getQueryParams } from '@shopgate/pwa-common/selectors/history';
import { SEARCH_PATH } from '@shopgate/pwa-common-commerce/search/constants';
import { getSearchPhrase } from 'Components/Navigator/selectors';

/**
 * Performs appropriate action(s) when UI search gets triggered.
 * @return {Function} A redux thunk.
 */
const submitSearch = () => (dispatch, getState) => {
  const state = getState();
  const { sort, ...otherParams } = getQueryParams(state);

  // Set up next history location.
  const historyLocation = {
    pathname: SEARCH_PATH,
    params: {
      ...otherParams,
      s: getSearchPhrase(state),
    },
  };

  // Move to the search location.
  dispatch(pushHistory(historyLocation));
};

export default submitSearch;
