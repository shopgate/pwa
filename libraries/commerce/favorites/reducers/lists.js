import { produce } from 'immer';
import {
  RECEIVE_FAVORITES_LISTS,
  SUCCESS_ADD_FAVORITES_LIST,
  SUCCESS_UPDATE_FAVORITES_LIST,
  SUCCESS_REMOVE_FAVORITES_LIST,
  OPEN_FAVORITE_LIST_CHOOSER,
  CLOSE_FAVORITE_LIST_CHOOSER,
  FAVORITES_LIFETIME,
} from '../constants';

/**
 * Favorites lists reducer.
 * @param {Object} state Current state.
 * @param {Object} action Dispatched action.
 * @returns {Object} New state.
 */
const lists = (state = {
  expires: 0,
  lists: [],
  chooser: null,
}, action) => {
  /* eslint-disable no-param-reassign */
  const newState = produce(state, (draft) => {
    switch (action.type) {
      case OPEN_FAVORITE_LIST_CHOOSER: {
        draft.chooser = {
          productId: action.productId,
          withRelatives: action.withRelatives,
        };
        break;
      }

      case CLOSE_FAVORITE_LIST_CHOOSER: {
        draft.chooser = null;
        break;
      }

      case RECEIVE_FAVORITES_LISTS: {
        draft.expires = Date.now() + FAVORITES_LIFETIME;
        draft.lists = action.favoritesLists;
        break;
      }

      case SUCCESS_ADD_FAVORITES_LIST: {
        draft.lists.push({
          id: action.listId,
          name: action.name,
        });
        break;
      }

      case SUCCESS_UPDATE_FAVORITES_LIST: {
        const list = draft.lists.find(l => l.id === action.listId);
        list.name = action.name;
        break;
      }

      case SUCCESS_REMOVE_FAVORITES_LIST: {
        const listIndex = draft.lists.findIndex(l => l.id === action.listId);
        draft.lists.splice(listIndex, 1);
        break;
      }

      default:
        break;
    }
  });
  /* eslint-enable no-param-reassign */
  return newState;
};

export default lists;
