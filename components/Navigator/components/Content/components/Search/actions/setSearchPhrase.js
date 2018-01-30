/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { getSearchPhrase } from '@shopgate/pwa-common/selectors/history';
import { setSearchPhrase as setPhrase } from 'Components/Navigator/action-creators';

/**
 * Removes the last entry from the active filters stack.
 * @param {string} query The request query.
 * @returns {Function} A redux thunk.
 */
const setSearchPhrase = query => (dispatch, getState) => {
  const searchPhrase = getSearchPhrase(getState()) || '';

  if (query === searchPhrase) {
    return;
  }

  dispatch(setPhrase(query));
};

export default setSearchPhrase;
