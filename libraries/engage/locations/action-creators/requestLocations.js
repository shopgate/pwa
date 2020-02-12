import { REQUEST_LOCATIONS } from '../constants';

/**
 * Dispatches the REQUEST_PRODUCT_LOCATIONS action.
 * @param {Object} params fetch params.
 * @return {Object} The REQUEST_PRODUCT_LOCATIONS action.
 */
const requestLocations = params => ({
  type: REQUEST_LOCATIONS,
  params,
});

export default requestLocations;
