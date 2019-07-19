import { uniq } from 'lodash';
import {
  REQUEST_ADD_FAVORITES,
  SUCCESS_ADD_FAVORITES,
  CANCEL_REQUEST_SYNC_FAVORITES,
  ERROR_ADD_FAVORITES,
  REQUEST_REMOVE_FAVORITES,
  SUCCESS_REMOVE_FAVORITES,
  ERROR_REMOVE_FAVORITES,
  REQUEST_FAVORITES,
  ERROR_FETCH_FAVORITES,
  RECEIVE_FAVORITES,
  FAVORITES_LIFETIME,
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
  syncCount: 0,
}, action) => {
  switch (action.type) {
    case REQUEST_ADD_FAVORITES:
      return {
        ...state,
        ids: uniq([
          ...state.ids,
          action.productId,
        ]),
        lastChange: Date.now(),
        syncCount: state.syncCount + 1,
      };
    case REQUEST_REMOVE_FAVORITES:
      return {
        ...state,
        ids: state.ids.filter(id => id !== action.productId),
        lastChange: Date.now(),
        syncCount: state.syncCount + 1,
      };
    case CANCEL_REQUEST_SYNC_FAVORITES:
      // Sync count needs to be updated, when an add or a remove favorites action is cancelled
      // This recovers from invalid sync states when a backend call is detected to be redundant
      return {
        ...state,
        syncCount: state.syncCount - action.count,
        // ids must remain unchanged, because it's managed by all other actions
      };
    case SUCCESS_ADD_FAVORITES:
    case SUCCESS_REMOVE_FAVORITES:
      return {
        ...state,
        lastChange: Date.now(),
        syncCount: state.syncCount - 1,
      };
    case ERROR_ADD_FAVORITES:
      // Clean up by removing the previously added product id
      return {
        ...state,
        ids: state.ids.filter(id => id !== action.productId),
        lastChange: Date.now(),
        syncCount: state.syncCount - 1,
      };
    case ERROR_REMOVE_FAVORITES:
      // Clean up by adding the previously removed product id back in
      return {
        ...state,
        ids: uniq([
          ...state.ids,
          action.productId,
        ]),
        lastChange: Date.now(),
        syncCount: state.syncCount - 1,
      };
    case REQUEST_FAVORITES:
      return {
        ...state,
        isFetching: true,
        ids: state.ids,
        expires: 0,
        // No `ready` prop here! It should be undefined on first request and stay true later!
        // `syncCount` stays untouched because this is not considered to be a sync.
      };
    case RECEIVE_FAVORITES:
      /**
       * Note: When favorites are received, an add or remove request can be in progress. In this
       *       case only fetching state will be updated and the received data will be discarded.
       *       A new fetch request will be queued as soon as the sync is done, which will recover
       *       discarded data.
       */
      return {
        ...state,
        ...(state.ready && (state.syncCount > 0 || state.lastChange > action.requestTimestamp))
          ? { isFetching: false }
          : {
            isFetching: false,
            expires: Date.now() + FAVORITES_LIFETIME,
            ids: action.products.map(product => product.id),
            ready: true,
            // `syncCount` stays untouched because this is not considered to be a sync.
          },
      };
    case ERROR_FETCH_FAVORITES:
      return {
        ...state,
        isFetching: false,
        ids: state.ids,
        expires: 0,
        ready: true,
        // `syncCount` stays untouched because this is not considered to be a sync.
      };
    default:
      return state;
  }
};

export default products;
