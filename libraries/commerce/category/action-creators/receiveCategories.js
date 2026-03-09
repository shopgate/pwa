import { RECEIVE_CATEGORIES } from '../constants';

/**
 * Action to put multiple categories into the redux store with a single dispatch.
 * @param {Object[]} categories The received categories.
 * @return {Object} The RECEIVE_CATEGORIES action.
 */
const receiveCategories = categories => ({
  type: RECEIVE_CATEGORIES,
  categories,
});

export default receiveCategories;
