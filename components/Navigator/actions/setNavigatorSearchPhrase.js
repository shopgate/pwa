/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { setSearchPhrase } from '../action-creators';
import { getSearchPhrase } from '../selectors';

/**
 * Sets the search phrase.
 * @param {string} phrase The new search phrase.
 * @return {Function} A redux thunk.
 */
const setNavigatorSearchPhrase = phrase => (dispatch, getState) => {
  if (getSearchPhrase(getState()) !== phrase) {
    dispatch(setSearchPhrase(phrase));
  }
};

export default setNavigatorSearchPhrase;
