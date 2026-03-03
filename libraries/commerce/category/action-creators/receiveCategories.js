import { RECEIVE_CATEGORIES } from '../constants';

/**
 * Dispatches an action to store multiple categories with a single action.
 * @param {Array} categories The received categories.
 * @return {Object} The RECEIVE_CATEGORIES action.
 */
const receiveCategories = categories => ({
  type: RECEIVE_CATEGORIES,
  categories,
  products: [],
});

export default receiveCategories;
