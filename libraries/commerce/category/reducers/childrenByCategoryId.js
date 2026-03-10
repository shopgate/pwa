import { produce } from 'immer';
import { ENOTFOUND } from '@shopgate/pwa-core/constants/Pipeline';
import {
  CATEGORY_LIFETIME,
  REQUEST_CATEGORY,
  RECEIVE_CATEGORY,
  RECEIVE_CATEGORIES,
  REQUEST_CATEGORY_CHILDREN,
  RECEIVE_CATEGORY_CHILDREN,
  ERROR_CATEGORY,
  ERROR_CATEGORY_CHILDREN,
} from '../constants';

/**
 * Inserts the given category children into the draft state for the given category ID.
 * @param {Object} draft The draft state to modify.
 * @param {string} categoryId The ID of the category to insert children for.
 * @param {Array} categoryChildren The children to insert.
 */
const insertChildren = (draft, categoryId, categoryChildren) => {
  const entry = draft[categoryId] ?? (draft[categoryId] = {});
  entry.children = categoryChildren ? categoryChildren.map(child => child.id) : null;
  entry.isFetching = false;
  entry.expires = Date.now() + CATEGORY_LIFETIME;
};

/**
 * Stores a collection of child category IDs by their parent's category ID.
 * @param {Object} [state={}] The current state.
 * @param {Object} action The action object.
 * @returns {Object} The new state.
 */
const childrenByCategoryId = (state = {}, action = {}) =>
  produce(state, (draft) => {
    switch (action.type) {
      case REQUEST_CATEGORY:
      case REQUEST_CATEGORY_CHILDREN: {
        const entry = draft[action.categoryId] ?? (draft[action.categoryId] = {});
        entry.children = null;
        entry.isFetching = true;
        entry.expires = 0;
        break;
      }

      case RECEIVE_CATEGORY:
      case RECEIVE_CATEGORY_CHILDREN: {
        insertChildren(draft, action.categoryId, action.categoryChildren);
        break;
      }

      case RECEIVE_CATEGORIES: {
        const categories = action.categories || [];
        categories.forEach((category) => {
          insertChildren(draft, category.id, category.children);
        });
        break;
      }

      case ERROR_CATEGORY:
      case ERROR_CATEGORY_CHILDREN: {
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

export default childrenByCategoryId;
