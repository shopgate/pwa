import { produce } from 'immer';
import {
  CATEGORY_LIFETIME,
  REQUEST_ROOT_CATEGORIES,
  RECEIVE_ROOT_CATEGORIES,
  ERROR_ROOT_CATEGORIES,
} from '../constants';
import handleReceivedCategories from './helpers/handleReceivedCategories';

/**
 * Stores a collection of category IDs that represent the
 * highest level of categories with no parent.
 * @param {Object} [state={}] The current application state.
 * @param {Object} [action={}] The action object.
 * @return {Object} The store data.
 */
const rootCategories = (state = {}, action = {}) =>
  produce(state, (draft) => {
    switch (action.type) {
      case REQUEST_ROOT_CATEGORIES:
        draft.categories = null;
        draft.expires = 0;
        draft.isFetching = true;
        break;

      case RECEIVE_ROOT_CATEGORIES:
        draft.categories = handleReceivedCategories(action.categories);
        draft.expires = Date.now() + CATEGORY_LIFETIME;
        draft.isFetching = false;
        break;

      case ERROR_ROOT_CATEGORIES:
        draft.isFetching = false;
        break;

      default:
        break;
    }
  });

export default rootCategories;
