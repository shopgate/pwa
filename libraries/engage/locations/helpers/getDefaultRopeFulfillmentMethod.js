import configuration from '@shopgate/pwa-common/collections/Configuration';
import { BOPIS, DEFAULT_ROPE_FULFILLMENT_METHOD } from '../constants';

/**
 * Determines the fulfillment method for card related requests
 * @return {string}
 */
const getDefaultRopeFulfillmentMethod = () =>
  configuration.get(DEFAULT_ROPE_FULFILLMENT_METHOD) || BOPIS;

export default getDefaultRopeFulfillmentMethod;
