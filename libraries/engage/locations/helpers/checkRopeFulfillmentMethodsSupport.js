import { ROPIS, BOPIS } from '../constants';

/**
 * Checks if an fulfillment methods array contains supported fulfillment methods.
 * @param {Array} fulfillmentMethods An array of product fulfillment methods.
 * @return {boolean}
 */
const checkRopeFulfillmentMethodsSupport = (fulfillmentMethods = []) => {
  if (!Array.isArray(fulfillmentMethods)) {
    return false;
  }

  return fulfillmentMethods.includes(ROPIS) || fulfillmentMethods.includes(BOPIS);
};

export default checkRopeFulfillmentMethodsSupport;
