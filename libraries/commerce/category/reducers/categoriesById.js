import { produce } from 'immer';
import { ENOTFOUND } from '@shopgate/pwa-core/constants/Pipeline';
import {
  CATEGORY_LIFETIME,
  RECEIVE_ROOT_CATEGORIES,
  REQUEST_CATEGORY,
  RECEIVE_CATEGORY,
  RECEIVE_CATEGORIES,
  RECEIVE_CATEGORY_CHILDREN,
  ERROR_CATEGORY,
} from '../constants';
import handleCategoryCollection from './helpers/handleCategoryCollection';

/**
 * Inserts a category into the draft state.
 * @param {Object} draft The draft state to modify.
 * @param {string} categoryId The ID of the category to insert.
 * @param {Object} categoryData The data of the category to insert.
 * @param {Array} categoryChildren The children of the category to insert.
 */
const insertCategory = (draft, categoryId, categoryData, categoryChildren) => {
  const entry = draft[categoryId] ?? (draft[categoryId] = {});
  Object.assign(entry, categoryData, {
    expires: Date.now() + CATEGORY_LIFETIME,
    isFetching: false,
  });

  const collected = handleCategoryCollection(categoryChildren);
  if (collected && typeof collected === 'object') {
    Object.assign(draft, collected);
  }
};

/**
 * Stores categories by their ID.
 * @param {Object} [state={}] The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
const categoriesById = (state = {}, action = {}) =>
  produce(state, (draft) => {
    switch (action.type) {
      case REQUEST_CATEGORY: {
        const entry = draft[action.categoryId] ?? (draft[action.categoryId] = {});
        entry.expires = 0;
        entry.isFetching = true;
        break;
      }

      case RECEIVE_CATEGORY: {
        // Strip children from category data. They are handled by the childrenByCategoryId reducer.
        const { children: ignore, ...categoryData } = action.categoryData || {};

        insertCategory(draft, action.categoryId, categoryData, action.categoryChildren);
        break;
      }

      case RECEIVE_CATEGORIES: {
        const categories = action.categories || [];
        categories.forEach((category) => {
          const { children: ignore, ...categoryData } = category || {};

          insertCategory(draft, category.id, categoryData, category.children);
        });

        break;
      }

      case RECEIVE_ROOT_CATEGORIES: {
        const collected = handleCategoryCollection(action.categories);
        if (collected && typeof collected === 'object') {
          Object.assign(draft, collected);
        }
        break;
      }

      case RECEIVE_CATEGORY_CHILDREN: {
        const collected = handleCategoryCollection(action.categoryChildren);
        if (collected && typeof collected === 'object') {
          Object.assign(draft, collected);
        }
        break;
      }

      case ERROR_CATEGORY: {
        if (action.errorCode === ENOTFOUND) {
          // Remove the temporary entry from the state when nothing was found for the categoryId.
          delete draft[action.categoryId];
          break;
        }

        const entry = draft[action.categoryId];
        if (!entry) {
          break;
        }
        entry.isFetching = false;
        break;
      }

      default:
        break;
    }
  });

export default categoriesById;
