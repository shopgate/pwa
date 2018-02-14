/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { disableSearch } from '../action-creators';
import { isSearchShowing } from '../selectors';

/**
 * Disables the Navigator's search.
 * @return {Function} A redux thunk.
 */
const disableNavigatorSearch = () => (dispatch, getState) => {
  if (isSearchShowing(getState())) {
    dispatch(disableSearch());
  }
};

export default disableNavigatorSearch;
