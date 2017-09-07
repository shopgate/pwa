/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  REQUEST_CLIENT_INFORMATION,
  RECEIVE_CLIENT_INFORMATION,
  ERROR_CLIENT_INFORMATION,
} from '../../constants/ActionTypes';
import { persist } from '../../store/persistent';

/**
 * The current version of the state created by this reducer.
 * @type {string}
 */
const STATE_VERSION = 'v1';

/**
 * Stores all the client information.
 * This part of the store is stored in the localStorage!
 * @param {Object} [state] The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
const reducer = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_CLIENT_INFORMATION:
      return {
        ...state,
        isFetching: true,
      };
    case RECEIVE_CLIENT_INFORMATION:
      return {
        ...state,
        ...action.data,
        isFetching: false,
      };
    case ERROR_CLIENT_INFORMATION:
      return {
        ...state,
        isFetching: false,
      };
    default:
      return state;
  }
};

export default persist('client', reducer, STATE_VERSION);
