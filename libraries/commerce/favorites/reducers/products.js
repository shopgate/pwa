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
  SUCCESS_REMOVE_FAVORITES_LIST,
  SUCCESS_ADD_FAVORITES_LIST,
  RECEIVE_FAVORITES,
  FAVORITES_LIFETIME,
  REQUEST_FAVORITES_IDS,
  RECEIVE_FAVORITES_IDS,
  ERROR_FAVORITES_IDS,
} from '../constants';

const defaultState = {
  byList: {},
};

/**
 * Favorites reducer.
 * @param {Object} state Current state.
 * @param {Object} action Dispatched action.
 * @returns {Object} New state.
 */
const products = (state = defaultState, action) => {
  switch (action.type) {
    // Handle an new favorites request.
    case REQUEST_FAVORITES: {
      const existingList = state.byList[action.listId];

      if (!existingList) {
        return {
          ...state,
          byList: {
            ...state.byList,
            [action.listId]: {
              isFetching: true,
              lastChange: 0,
              lastFetch: 0,
              expires: 0,
              ids: [],
              syncCount: 0,
              ready: false,
            },
          },
        };
      }

      return {
        ...state,
        byList: {
          ...state.byList,
          [action.listId]: {
            ...existingList,
            isFetching: true,
            expires: 0,
            ready: false,
          },
        },
      };
    }

    // Handle incoming favorite products.
    case RECEIVE_FAVORITES: {
      const list = state.byList[action.listId];
      const isSynching = list.syncCount > 0;
      const isOngoing = state.lastChange > action.requestTimestamp;

      /**
       * Note: When favorites are received, an add or remove request can be in progress. In this
       *       case only fetching state will be updated and the received data will be discarded.
       *       A new fetch request will be queued as soon as the sync is done, which will recover
       *       discarded data.
      */
      if (list.ready && (isSynching || isOngoing)) {
        return {
          ...state,
          byList: {
            ...state.byList,
            [action.listId]: {
              ...list,
              isFetching: false,
            },
          },
        };
      }

      // `syncCount` stays untouched because this is not considered to be a sync.
      return {
        ...state,
        byList: {
          ...state.byList,
          [action.listId]: {
            ...list,
            isFetching: true,
            expires: Date.now() + FAVORITES_LIFETIME,
            ids: action.products.map(product => product.id),
            ready: true,
          },
        },
      };
    }

    // Handle failed fetching
    case ERROR_FETCH_FAVORITES: {
      const list = state.byList[action.listId];
      return {
        ...state,
        byList: {
          ...state.byList,
          [action.listId]: {
            ...list,
            isFetching: false,
            expires: 0,
            ready: true,
          },
        },
      };
      // `syncCount` stays untouched because this is not considered to be a sync.
    }

    // Handle adding favorite list products.
    case REQUEST_ADD_FAVORITES: {
      const list = state.byList[action.listId];
      return {
        ...state,
        byList: {
          ...state.byList,
          [action.listId]: {
            ...list,
            ids: uniq([
              ...list.ids,
              action.productId,
            ]),
            lastChange: Date.now(),
            syncCount: list.syncCount + 1,
          },
        },
      };
    }

    // Handle removing favorite list products.
    case REQUEST_REMOVE_FAVORITES: {
      const list = state.byList[action.listId];
      return {
        ...state,
        byList: {
          ...state.byList,
          [action.listId]: {
            ...list,
            ids: list.ids.filter(id => id !== action.productId),
            lastChange: Date.now(),
            syncCount: list.syncCount + 1,
          },
        },
      };
    }

    // Handle cancellation of synchronization.
    // Sync count needs to be updated, when an add or a remove favorites action is cancelled
    // This recovers from invalid sync states when a backend call is detected to be redundant
    case CANCEL_REQUEST_SYNC_FAVORITES: {
      const list = state.byList[action.listId];
      return {
        ...state,
        byList: {
          ...state.byList,
          [action.listId]: {
            ...list,
            syncCount: list.syncCount + action.count,
          },
        },
      };
    }

    // Handle success of adding favorite list products.
    case SUCCESS_ADD_FAVORITES:
    case SUCCESS_REMOVE_FAVORITES: {
      const list = state.byList[action.listId];
      return {
        ...state,
        byList: {
          ...state.byList,
          [action.listId]: {
            ...list,
            lastChange: Date.now(),
            syncCount: list.syncCount - 1,
          },
        },
      };
    }

    // Handle deletion failure by adding the product back in to the list.
    case ERROR_REMOVE_FAVORITES: {
      const list = state.byList[action.listId];
      return {
        ...state,
        byList: {
          ...state.byList,
          [action.listId]: {
            ...list,
            ids: uniq([...state.ids, action.productId]),
            lastChange: Date.now(),
            syncCount: list.syncCount - 1,
          },
        },
      };
    }

    // Handle adding failure by removing the product from the list.
    case ERROR_ADD_FAVORITES: {
      const list = state.byList[action.listId];
      return {
        ...state,
        byList: {
          ...state.byList,
          [action.listId]: {
            ...list,
            ids: list.ids.filter(id => id !== action.productId),
            lastChange: Date.now(),
            syncCount: list.syncCount - 1,
          },
        },
      };
    }

    // Handle cleanup after deletion of a list.
    case SUCCESS_REMOVE_FAVORITES_LIST: {
      const { [action.listId]: removedListId, ...newByList } = state.byList;
      return {
        ...state,
        byList: newByList,
      };
    }

    // Handle adding new lists.
    case SUCCESS_ADD_FAVORITES_LIST: {
      return {
        ...state,
        byList: {
          ...state.byList,
          [action.listId]: {
            isFetching: true,
            lastChange: 0,
            lastFetch: 0,
            expires: 0,
            ids: [],
            syncCount: 0,
            ready: true,
          },
        },
      };
    }

    case REQUEST_FAVORITES_IDS: {
      const list = state.byList[action.listId];
      if (!list) {
        return {
          ...state,
          byList: {
            ...state.byList,
            [action.listId]: {
              isFetching: true,
              lastChange: 0,
              lastFetch: 0,
              expires: 0,
              ids: [],
              syncCount: 0,
            },
          },
        };
      }

      return {
        ...state,
        byList: {
          ...state.byList,
          [action.listId]: {
            ...list,
            isFetching: true,
            expires: 0,
          },
        },
      };
    }

    case RECEIVE_FAVORITES_IDS: {
      const list = state.byList[action.listId];
      return {
        ...state,
        byList: {
          ...state.byList,
          [action.listId]: {
            ...list,
            isFetching: false,
            expires: Date.now() + FAVORITES_LIFETIME,
            ids: action.productIds,
            ready: true,
          },
        },
      };
    }

    case ERROR_FAVORITES_IDS: {
      const list = state.byList[action.listId];
      return {
        ...state,
        byList: {
          ...state.byList,
          [action.listId]: {
            ...list,
            isFetching: false,
            expires: 0,
            ids: list.ids,
            ready: false,
          },
        },
      };
    }

    default:
      return state;
  }
};

export default products;
