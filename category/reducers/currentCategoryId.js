import { SET_CURRENT_CATEGORY_ID } from '../constants';
/**
 * Stores the current category id.
 * @param {Object} [state=null] The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
const currentCategoryId = (state = null, action) => {
  switch (action.type) {
    case SET_CURRENT_CATEGORY_ID:
      return action.categoryId || null;

    default:
      return state;
  }
};

export default currentCategoryId;
