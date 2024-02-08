import { produce } from 'immer';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';
import appConfig from '@shopgate/pwa-common/helpers/config';
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
  SUCCESS_UPDATE_FAVORITES,
  REQUEST_UPDATE_FAVORITES,
  ERROR_UPDATE_FAVORITES,
  RECEIVE_FAVORITES_LISTS,
} from '../constants';

const { addNewFavoritesOnTop = false } = appConfig;

/**
 * Favorites reducer.
 * @param {Object} state Current state.
 * @param {Object} action Dispatched action.
 * @returns {Object} New state.
 */
const products = (state = {
  byList: {},
}, action) => {
  /* eslint-disable no-param-reassign */
  const producedState = produce(state, (draft) => {
    switch (action.type) {
      // Handle a new favorites request.
      case REQUEST_FAVORITES: {
        const existingList = draft.byList[action.listId];

        if (!existingList) {
          draft.byList[action.listId] = {
            isFetching: true,
            lastChange: 0,
            lastFetch: 0,
            expires: 0,
            items: [],
            syncCount: 0,
          };
          return;
        }
        existingList.isFetching = true;
        existingList.expires = 0;
        break;
      }

      // Handle incoming favorite products.
      case RECEIVE_FAVORITES: {
        const list = draft.byList[action.listId];
        const isSynching = list.syncCount > 0;
        const isOngoing = state.lastChange > action.requestTimestamp;

        /**
         * Note: When favorites are received, an add or remove request can be in progress. In this
         *       case only fetching state will be updated and the received data will be discarded.
         *       A new fetch request will be queued as soon as the sync is done, which will recover
         *       discarded data.
        */
        list.isFetching = false;
        if (list.ready && (isSynching || isOngoing)) {
          return;
        }

        list.expires = Date.now() + FAVORITES_LIFETIME;
        list.items = action.items.map(({ quantity, notes, product }) =>
          ({ quantity, notes, productId: product.id }));
        list.ready = true;
        // `syncCount` stays untouched because this is not considered to be a sync.
        break;
      }

      // Handle failed fetching
      case ERROR_FETCH_FAVORITES: {
        const list = draft.byList[action.listId];
        list.isFetching = false;
        list.expires = 0;
        list.ready = true;
        // `syncCount` stays untouched because this is not considered to be a sync.
        break;
      }

      // Handle adding favorite list products.
      case REQUEST_ADD_FAVORITES: {
        const list = draft.byList[action.listId];
        const matchingItem = list.items
          .find(({ productId }) => productId === action.productId);

        if (matchingItem) {
          matchingItem.notes = typeof action.notes === 'string' ? action.notes : matchingItem.notes;
          matchingItem.quantity = typeof action.quantity === 'number' ? matchingItem.quantity + action.quantity : matchingItem.quantity + 1;
        } else {
          const newEntry = {
            notes: action.notes || '',
            quantity: action.quantity || 1,
            productId: action.productId,
          };

          if (addNewFavoritesOnTop) {
            list.items.unshift(newEntry);
          } else {
            list.items.push(newEntry);
          }
        }
        list.lastChange = Date.now();
        list.syncCount += 1;
        break;
      }

      case REQUEST_UPDATE_FAVORITES: {
        const list = draft.byList[action.listId];
        const matchingItem = list.items
          .find(({ productId }) => productId === action.productId);

        if (matchingItem) {
          if (isNumber(action.quantity)) {
            matchingItem.quantity = action.quantity;
          }

          if (isString(action.notes)) {
            matchingItem.notes = action.notes;
          }
          list.lastChange = Date.now();
          list.syncCount += 1;
        }
        break;
      }

      // Handle removing favorite list products.
      case REQUEST_REMOVE_FAVORITES: {
        const list = draft.byList[action.listId];

        const matchingItemIndex = list.items
          .findIndex(({ productId }) => productId === action.productId);

        if (matchingItemIndex > -1) {
          list.items.splice(matchingItemIndex, 1);
        }

        list.lastChange = Date.now();
        list.syncCount += 1;
        break;
      }
      // Handle cancellation of synchronization.
      // Sync count needs to be updated, when an add or a remove favorites action is cancelled
      // This recovers from invalid sync states when a backend call is detected to be redundant
      case CANCEL_REQUEST_SYNC_FAVORITES: {
        const list = draft.byList[action.listId];
        list.syncCount -= action.count;
        break;
      }

      // Handle success of adding favorite list products.
      case SUCCESS_ADD_FAVORITES:
      case SUCCESS_UPDATE_FAVORITES:
      case SUCCESS_REMOVE_FAVORITES: {
        const list = draft.byList[action.listId];
        list.lastChange = Date.now();
        list.syncCount -= 1;
        break;
      }

      // Handle deletion failure by adding the product back in to the list.
      case ERROR_REMOVE_FAVORITES: {
        const list = draft.byList[action.listId];
        const newEntry = {
          productId: action.productId,
          quantity: action.quantity || 1,
          notes: action.notes || '',
        };

        if (addNewFavoritesOnTop) {
          list.items.unshift(newEntry);
        } else {
          list.items.push(newEntry);
        }

        list.lastChange = Date.now();
        list.syncCount -= 1;
        break;
      }

      // Handle adding failure by removing the product from the list.
      case ERROR_ADD_FAVORITES: {
        const list = draft.byList[action.listId];

        const matchingItemIndex = list.items
          .findIndex(({ productId }) => productId === action.productId);
        if (matchingItemIndex > -1) {
          list.items.splice(matchingItemIndex, 1);
        }

        list.lastChange = Date.now();
        list.syncCount -= 1;
        break;
      }

      case ERROR_UPDATE_FAVORITES: {
        const list = draft.byList[action.listId];

        list.lastChange = Date.now();
        list.syncCount -= 1;
        break;
      }

      // Handle cleanup after deletion of a list.
      case SUCCESS_REMOVE_FAVORITES_LIST: {
        delete draft.byList[action.listId];
        break;
      }

      // Handle adding new lists.
      case SUCCESS_ADD_FAVORITES_LIST: {
        draft.byList[action.listId] = {
          isFetching: true,
          lastChange: 0,
          lastFetch: 0,
          expires: 0,
          items: [],
          syncCount: 0,
          ready: true,
        };
        break;
      }

      // Handle cleanup after lists are updated
      case RECEIVE_FAVORITES_LISTS: {
        const listIds = action.favoritesLists.map(({ id }) => id);

        Object.keys(draft.byList).forEach((id) => {
          if (!listIds.includes(id)) {
            // Remove list items that don't have a list anymore
            delete draft.byList[id];
          }
        });
        break;
      }

      default:
        break;
    }
  });
  /* eslint-enable no-param-reassign */
  return producedState;
};

export default products;
