import { uniq } from 'lodash';
import {
  ERROR_FETCH_FAVORITES,
  FAVORITES_LIFETIME,
  RECEIVE_FAVORITES,
  REQUEST_ADD_FAVORITES,
  REQUEST_FAVORITES,
  REQUEST_REMOVE_FAVORITES,
} from '../constants';

/**
 * Favorites reducer.
 * @param {Object} state Current state.
 * @param {Object} action Dispatched action.
 * @returns {Object} New state.
 */
const products = (state = {
  lastChange: 0,
  lastFetch: 0,
  expires: 0,
  ids: [],
}, action) => {
  switch (action.type) {
    case REQUEST_ADD_FAVORITES:
      return {
        ...state,
        isFetching: true, // Prevents fetch on enter.
        ids: uniq([
          ...state.ids,
          action.productId,
        ]),
        lastChange: Date.now(),
        outOfSync: true,
      };
    case REQUEST_REMOVE_FAVORITES:
      return !action.silent ? { // A silent remove is used when adding an item to the list fails.
        ...state,
        isFetching: true, // Prevents fetch on enter.
        ids: state.ids.filter(id => id !== action.productId),
        lastChange: Date.now(),
        outOfSync: true,
      } : {
        ...state,
        isFetching: false, // Silent remove only recovers from wrong states.
        ids: state.ids.filter(id => id !== action.productId),
        outOfSync: false,
      };
    case REQUEST_FAVORITES:
      return {
        ...state,
        isFetching: true,
        ids: state.ids,
        expires: 0,
        // No `.ready` prop here! It should be undefined on first request and stay true later!
      };
    case RECEIVE_FAVORITES:
      return {
        ...state,
        ...(state.ready && (state.outOfSync || state.lastChange > action.requestTimestamp)) ? {} : {
          isFetching: false,
          expires: Date.now() + FAVORITES_LIFETIME,
          ids: action.products.map(product => product.id),
          ready: true,
        },
      };
    case ERROR_FETCH_FAVORITES:
      return {
        ...state,
        isFetching: false,
        ids: state.ids,
        expires: 0,
        ready: true,
      };
    default:
      return state;
  }
};

export default products;
