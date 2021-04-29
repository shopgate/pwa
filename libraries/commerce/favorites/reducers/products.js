import { uniq } from 'lodash';
import { SUCCESS_LOGOUT } from '@shopgate/pwa-common/constants/ActionTypes';
import {
  ADD_PRODUCT_TO_FAVORITES,
  ERROR_ADD_FAVORITES,
  ERROR_REMOVE_FAVORITES,
  FAVORITES_LIFETIME,
  RECEIVE_FAVORITES_IDS,
  REMOVE_PRODUCT_FROM_FAVORITES,
  REQUEST_FAVORITES_IDS,
  SUCCESS_ADD_FAVORITES,
  SUCCESS_REMOVE_FAVORITES,
  ERROR_FAVORITES_IDS,
} from '../constants';

const defaultState = {
  expires: 0,
  ids: [],
  originalIds: [],
  ready: false,
};

/**
 * Favorites reducer.
 * @param {Object} state Current state.
 * @param {Object} action Dispatched action.
 * @returns {Object} New state.
 */
const products = (state = defaultState, action) => {
  switch (action.type) {
    case ADD_PRODUCT_TO_FAVORITES: {
      const adds = [].concat(action.productId);
      return {
        ...state,
        ids: Array.from(new Set([...adds, ...state.ids])).filter(Boolean),
      };
    }
    case REMOVE_PRODUCT_FROM_FAVORITES: {
      const removes = [].concat(action.productId);
      return {
        ...state,
        ids: state.ids.filter(id => !removes.includes(id)),
      };
    }

    // Add succeeded to original storage
    case SUCCESS_ADD_FAVORITES: {
      const added = [].concat(action.productId);
      return {
        ...state,
        originalIds: Array.from(new Set([...added, ...state.originalIds])),
      };
    }

    // Remove succeeded from original storage
    case SUCCESS_REMOVE_FAVORITES: {
      const removed = [].concat(action.productId);
      return {
        ...state,
        originalIds: state.originalIds.filter(id => !removed.includes(id))
        ,
      };
    }

    case ERROR_ADD_FAVORITES: {
      // Clean up by removing the previously added product id
      const added = [].concat(action.productId);
      return {
        ...state,
        ids: state.ids.filter(id => !added.includes(id)),
      };
    }

    case ERROR_REMOVE_FAVORITES:
      // Clean up by adding the previously removed product id back in
      return {
        ...state,
        ids: uniq([
          ...[].concat(action.productId),
          ...state.ids,
        ]),
      };

    case REQUEST_FAVORITES_IDS:
      return {
        ...state,
        isFetching: true,
        ids: state.ids,
        expires: 0,
      };

    case RECEIVE_FAVORITES_IDS:
      return {
        ...state,
        isFetching: false,
        expires: Date.now() + FAVORITES_LIFETIME,
        ids: action.productIds,
        originalIds: action.productIds,
        ready: true,
      };

    case ERROR_FAVORITES_IDS:
      return {
        ...state,
        isFetching: false,
        ids: state.ids,
        expires: 0,
        ready: false,
      };
    case SUCCESS_LOGOUT:
      return defaultState;

    default:
      return state;
  }
};

export default products;
