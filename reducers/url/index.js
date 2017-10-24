/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  REQUEST_URL,
  RECEIVE_URL,
  ERROR_URL,
} from '../../constants/ActionTypes';
import { persist } from '../../store/persistent';

const URL_LIFETIME = 31536000000; // 1 year in milliseconds

/**
 * The current version of the state created by this reducer.
 * @type {string}
 */
const STATE_VERSION = 'v1';

/**
 * A blacklist of keys to not include in the localstorage.
 * @type {string}
 */
const blacklist = ['checkout'];

/**
 * Stores the requested urls
 * This part of the store is stored in the localStorage!
 * @param {Object} [state] The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
const reducer = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_URL:
      return {
        ...state,
        [action.urlType]: {
          ...state[action.urlType],
          url: null,
          isFetching: true,
          expires: 0,
        },
      };
    case RECEIVE_URL:
      return {
        ...state,
        [action.urlType]: {
          ...state[action.urlType],
          url: action.url,
          isFetching: false,
          expires: action.expires ? Date.parse(action.expires) : (Date.now() + URL_LIFETIME),
        },
      };
    case ERROR_URL:
      return {
        ...state,
        [action.urlType]: {
          ...state[action.urlType],
          url: null,
          isFetching: false,
          expires: 0,
        },
      };
    default:
      return state;
  }
};

export default persist('url', reducer, STATE_VERSION, blacklist);
