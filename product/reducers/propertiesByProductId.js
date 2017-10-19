/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  PRODUCT_LIFETIME,
  REQUEST_PRODUCT_PROPERTIES,
  RECEIVE_PRODUCT_PROPERTIES,
  ERROR_PRODUCT_PROPERTIES,
} from '../constants';

/**
 * Stores product properties by their product ID.
 * @param {Object} [state={}] The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default function propertiesByProductId(state = {}, action) {
  switch (action.type) {
    case REQUEST_PRODUCT_PROPERTIES:
      return {
        ...state,
        [action.productId]: {
          ...state[action.productId],
          isFetching: true,
          expires: 0,
        },
      };
    case RECEIVE_PRODUCT_PROPERTIES:
      return {
        ...state,
        [action.productId]: {
          ...state[action.productId],
          properties: action.properties,
          isFetching: false,
          expires: Date.now() + PRODUCT_LIFETIME,
        },
      };
    case ERROR_PRODUCT_PROPERTIES:
      return {
        ...state,
        [action.productId]: {
          ...state[action.productId],
          isFetching: false,
        },
      };
    default:
      return state;
  }
}
