import {
  RECEIVE_FAVORITES_LISTS,
  SUCCESS_ADD_FAVORITES_LIST,
  SUCCESS_UPDATE_FAVORITES_LIST,
  SUCCESS_REMOVE_FAVORITES_LIST,
  OPEN_FAVORITE_LIST_CHOOSER,
  CLOSE_FAVORITE_LIST_CHOOSER,
  FAVORITES_LIFETIME,
  FLUSH_FAVORITES,
} from '../constants';

const defaultState = {
  expires: 0,
  lists: [],
  chooser: null,
};

/**
 * Favorites lists reducer.
 * @param {Object} state Current state.
 * @param {Object} action Dispatched action.
 * @returns {Object} New state.
 */
const lists = (state = defaultState, action) => {
  switch (action.type) {
    case FLUSH_FAVORITES: {
      return {
        ...state,
        lists: [],
      };
    }

    case OPEN_FAVORITE_LIST_CHOOSER: {
      return {
        ...state,
        chooser: {
          productId: action.productId,
          withRelatives: action.withRelatives,
        },
      };
    }

    case CLOSE_FAVORITE_LIST_CHOOSER: {
      return {
        ...state,
        chooser: null,
      };
    }

    case RECEIVE_FAVORITES_LISTS: {
      return {
        ...state,
        expires: Date.now() + FAVORITES_LIFETIME,
        lists: action.favoritesLists,
      };
    }

    case SUCCESS_ADD_FAVORITES_LIST: {
      const newLists = [...state.lists];
      newLists.push({
        id: action.listId,
        name: action.name,
      });
      return {
        ...state,
        lists: newLists,
      };
    }

    case SUCCESS_UPDATE_FAVORITES_LIST: {
      const newList = state.lists.map((list) => {
        if (list.id === action.listId) {
          return {
            ...list,
            name: action.name,
          };
        }
        return list;
      });
      return {
        ...state,
        lists: newList,
      };
    }

    case SUCCESS_REMOVE_FAVORITES_LIST: {
      const newList = state.lists.filter(l => l.id !== action.listId);
      return {
        ...state,
        lists: newList,
      };
    }

    default:
      return state;
  }
};

export default lists;
