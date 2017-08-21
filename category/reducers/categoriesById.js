import {
  CATEGORY_LIFETIME,
  RECEIVE_ROOT_CATEGORIES,
  REQUEST_CATEGORY,
  RECEIVE_CATEGORY,
  RECEIVE_CATEGORY_CHILDREN,
  ERROR_CATEGORY,
} from '../constants';

/**
 * Builds state entries from a collection of categories.
 * @param {Array} collection A category collection.
 * @return {Object} The category entries for the state.
 */
const handleCategoryCollection = (collection) => {
  const categoryObjects = {};
  // Is used to set them all to the same date because they arrived at the same time.
  const expires = Date.now() + CATEGORY_LIFETIME;

  if (!collection) {
    return categoryObjects;
  }

  collection.forEach((category) => {
    const { children, ...categoryData } = category;

    categoryObjects[category.id] = {
      ...categoryData,
      isFetching: false,
      expires,
    };
  });

  return categoryObjects;
};

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
      const { children, ...categoryData } = action.categoryData;

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

    // TODO: improve the error handling here once CON-1329 is done
    case ERROR_CATEGORY:
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
