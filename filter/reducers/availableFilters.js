/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  REQUEST_FILTERS,
  RECEIVE_FILTERS,
  ERROR_FILTERS,
} from '../constants';
import { PRODUCT_LIFETIME } from '../../product/constants';
import enrichFilters from './helpers/enrichFilters';

/**
 * Stores a collection of available filters by the related hash of the request parameters.
 * @param {Object} [state={}] The current state.
 * @param {Object} action The current redux action.
 * @return {Object} The new state.
 */
export default function availableFilters(state = {}, action) {
  switch (action.type) {
    case REQUEST_FILTERS: {
      return {
        ...state,
        [action.hash]: {
          filters: null,
          isFetching: true,
          expires: 0,
        },
      };
    }
    case RECEIVE_FILTERS: {
      return {
        ...state,
        [action.hash]: {
          filters: enrichFilters(action.filters),
          isFetching: false,
          expires: Date.now() + PRODUCT_LIFETIME,
        },
      };
    }
    case ERROR_FILTERS:
      return {
        ...state,
        [action.hash]: {
          ...state[action.hash],
          isFetching: false,
        },
      };
    default:
      return state;
  }
}
