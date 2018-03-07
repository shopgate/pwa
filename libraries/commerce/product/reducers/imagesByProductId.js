/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  PRODUCT_LIFETIME,
  REQUEST_PRODUCT_IMAGES,
  RECEIVE_PRODUCT_IMAGES,
  ERROR_PRODUCT_IMAGES,
} from '../constants';

/**
 * Stores product images by product id
 * @param {Object} state Current state.
 * @param {Object} action The action object.
 * @returns {Object}
 */
export default function imagesByProductId(state = {}, action) {
  switch (action.type) {
    case REQUEST_PRODUCT_IMAGES:
      return {
        ...state,
        [action.productId]: {
          ...state[action.productId],
          isFetching: true,
          expires: 0,
        },
      };
    case RECEIVE_PRODUCT_IMAGES:
      return {
        ...state,
        [action.productId]: {
          isFetching: false,
          expires: Date.now() + PRODUCT_LIFETIME,
          images: action.productImages,
        },
      };
    case ERROR_PRODUCT_IMAGES:
      return {
        ...state,
        [action.productId]: {
          isFetching: false,
        },
      };
    default:
      return state;
  }
}
