import { PipelineRequest, logger } from '@shopgate/engage/core';
import {
  requestLocations,
  receiveLocations,
  errorLocations,
} from '../action-creators';
import { SHOPGATE_STOREFRONT_GET_LOCATIONS } from '../constants';

/**
 * @param {Object} params params.
 * @returns {Function} A redux thunk.
 */
function fetchLocations(params) {
  return (dispatch) => {
    dispatch(requestLocations(params));
    const request = new PipelineRequest(SHOPGATE_STOREFRONT_GET_LOCATIONS)
      .setInput(params)
      .dispatch();

    request
      .then((result) => {
        dispatch(receiveLocations(result.locations));
      })
      .catch((error) => {
        logger.error(error);
        dispatch(errorLocations(params, error));
      });

    return request;
  };
}

export default fetchLocations;
