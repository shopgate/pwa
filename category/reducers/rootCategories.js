import {
  CATEGORY_LIFETIME,
  REQUEST_ROOT_CATEGORIES,
  RECEIVE_ROOT_CATEGORIES,
  ERROR_ROOT_CATEGORIES,
} from '../constants';

/**
 * Handles the received category id's by mapping to store and returning results.
 * @param {Array} categories The received categories.
 * @returns {Array} An array of category objects.
 */
const handleReceivedCategories = categories =>
  (categories.length ? categories.map(category => category.id) : null)
;

/**
 * Stores a collection of category IDs that represent the
 * highest level of categories with no parent.
 * @param {Object} [state={}] The current application state.
 * @param {Object} action The action object.
 * @return {Object} The store data.
 */
const rootCategories = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_ROOT_CATEGORIES:
      return {
        ...state,
        categories: null,
        expires: 0,
        isFetching: true,
      };

    case RECEIVE_ROOT_CATEGORIES:
      return {
        ...state,
        categories: handleReceivedCategories(action.categories),
        expires: Date.now() + CATEGORY_LIFETIME,
        isFetching: false,
      };

    case ERROR_ROOT_CATEGORIES:
      return {
        ...state,
        isFetching: false,
      };

    default:
      return state;
  }
};

export default rootCategories;
