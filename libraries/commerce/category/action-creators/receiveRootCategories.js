import { RECEIVE_ROOT_CATEGORIES } from '../constants';

/**
 * Dispatches the RECEIVE_ROOT_CATEGORIES action.
 * @param {Array} categories The received root categories.
 * @return {Object} The RECEIVE_ROOT_CATEGORIES action.
 */
const receiveRootCategories = categories => ({
  type: RECEIVE_ROOT_CATEGORIES,
  categories,
});

export default receiveRootCategories;
