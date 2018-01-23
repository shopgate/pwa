/**
 * Copyright (c) 2018, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {
  RECEIVE_FAVORITES,
  REQUEST_FAVORITES,
  ERROR_FETCH_FAVORITES,
  FAVORITES_LIFETIME,
  REQUEST_ADD_FAVORITES,
  RECEIVE_ADD_FAVORITES,
  ERROR_ADD_FAVORITES,
  REQUEST_REMOVE_FAVORITES,
  RECEIVE_REMOVE_FAVORITES,
  ERROR_REMOVE_FAVORITES,
} from '../constants';

/**
 * Favorites reducer.
 * @param {Object} state Current state.
 * @param {Object} action Dispatched action.
 * @returns {Object} New state.
 */
const products = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_FAVORITES:
      return {
        ...state,
        isFetching: true,
        ids: state.ids || [],
        expires: 0,
        // No ready here! It should be undefined or true!
      };
    case REQUEST_ADD_FAVORITES:
      return {
        ...state,
        isFetching: true,
        ids: [
          ...(state.ids || []),
          action.productId,
        ],
      };
    case REQUEST_REMOVE_FAVORITES:
      return {
        ...state,
        isFetching: true,
        ids: state.ids.filter(id => id !== action.productId),
      };
    case RECEIVE_FAVORITES:
      return {
        ...state,
        isFetching: false,
        expires: Date.now() + FAVORITES_LIFETIME,
        ids: action.products.map(product => product.id),
        ready: true,
      };
    case RECEIVE_ADD_FAVORITES:
    case RECEIVE_REMOVE_FAVORITES:
      return {
        ...state,
        isFetching: false,
      };
    case ERROR_ADD_FAVORITES:
      return {
        ...state,
        isFetching: false,
        ids: state.ids.filter(id => id !== action.productId),
      };
    case ERROR_REMOVE_FAVORITES:
      return {
        ...state,
        isFetching: false,
        ids: [
          ...state.ids,
          action.productId,
        ],
      };
    case ERROR_FETCH_FAVORITES:
      return {
        ...state,
        isFetching: false,
        ids: state.ids || [],
        expires: 0,
        ready: true,
      };
    default:
      return state;
  }
};

export default products;
