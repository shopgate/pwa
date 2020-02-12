import { ERROR_LOCATIONS } from '../constants';

/**
 * Dispatches the ERROR_LOCATIONS action object.
 * @param {Object} params fetch params.
 * @param {Error} error error
 * @return {Object} The ERROR_LOCATIONS action.
 */
const errorLocations = (params, error) => ({
  type: ERROR_LOCATIONS,
  params,
  error,
});

export default errorLocations;
