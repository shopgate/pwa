import { RECEIVE_CATEGORY } from '../constants';

/**
 * Dispatches the RECEIVE_CATEGORY action.
 * @param {string} categoryId The ID of the received category.
 * @param {Object} categoryData The data of the received category.
 * @param {Array} categoryChildren The children of received category.
 * @return {Object} The RECEIVE_CATEGORY action.
 */
const receiveCategory = (categoryId, categoryData, categoryChildren) => ({
  type: RECEIVE_CATEGORY,
  categoryId,
  categoryData,
  categoryChildren,
  products: [],
});

export default receiveCategory;
