import { RECEIVE_INVENTORIES } from '../constants';

/**
 * Creates the dispatched RECEIVE_INVENTORIES action object.
 * @param {Array} productInventories List of product inventories.
 * @return {Object} The RECEIVE_INVENTORIES action.
 */
const receiveInventories = productInventories => ({
  type: RECEIVE_INVENTORIES,
  productInventories,
});

export default receiveInventories;
