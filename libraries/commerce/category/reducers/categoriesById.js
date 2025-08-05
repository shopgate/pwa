import { ENOTFOUND } from '@shopgate/pwa-core/constants/Pipeline';
import {
  CATEGORY_LIFETIME,
  RECEIVE_ROOT_CATEGORIES,
  REQUEST_CATEGORY,
  RECEIVE_CATEGORY,
  RECEIVE_CATEGORY_CHILDREN,
  ERROR_CATEGORY,
} from '../constants';
import handleCategoryCollection from './helpers/handleCategoryCollection';

/**
 * Stores categories by their ID.
 * @param {Object} [state={}] The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
const categoriesById = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_CATEGORY:
      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          expires: 0,
          isFetching: true,
        },
      };

    case RECEIVE_CATEGORY: {
      const { children: ignore, ...categoryData } = action.categoryData;

      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          ...categoryData,
          expires: Date.now() + CATEGORY_LIFETIME,
          isFetching: false,
        },
        ...handleCategoryCollection(action.categoryChildren),
      };
    }

    case RECEIVE_ROOT_CATEGORIES:
      return {
        ...state,
        ...handleCategoryCollection(action.categories),
      };

    case RECEIVE_CATEGORY_CHILDREN:
      return {
        ...state,
        ...handleCategoryCollection(action.categoryChildren),
      };

    case ERROR_CATEGORY:
      if (action.errorCode === ENOTFOUND) {
        // Remove the temporary entry from the state when noting was found for the categoryId.
        const { [action.categoryId]: ignore, ...rest } = state;
        return rest;
      }

      return {
        ...state,
        [action.categoryId]: {
          ...state[action.categoryId],
          isFetching: false,
        },
      };

    default:
      return state;
  }
};

export default categoriesById;
