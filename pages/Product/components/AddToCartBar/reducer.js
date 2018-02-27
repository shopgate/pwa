/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as actionTypes from './constants';

const defaultState = {
  added: 0,
};

/**
 * Stores all AddToCartBar information.
 * @param {Object} state The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.INCREMENT_ACTION_COUNT:
      return {
        added: state.added + 1,
      };
    case actionTypes.RESET_ACTION_COUNT:
      return {
        added: 0,
      };
    default:
      return state;
  }
};

