import { STORE_FULFILLMENT_METHOD } from '../constants';

/**
 * Creates the dispatched STORE_FULFILLMENT_METHOD action object.
 * @param {string} method The selected fulfillment method.
 * @returns {Object}
 */
const storeFulfillmentMethod = method => ({
  type: STORE_FULFILLMENT_METHOD,
  method,
});

export default storeFulfillmentMethod;
