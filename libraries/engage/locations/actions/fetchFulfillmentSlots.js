import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import {
  FETCH_FULFILLMENT_SLOTS_ERROR,
  FETCH_FULFILLMENT_SLOTS_SUCCESS,
} from '../constants/ActionTypes';

/**
 * @param {Object} params params.
 * @returns {Function} A redux thunk.
 */
function fetchFulfillmentSlots({ locationCode }) {
  return async (dispatch) => {
    const request = new PipelineRequest('shopgate.storefront.getFulfillmentSlots')
      .setInput({ locationCode })
      .dispatch();

    try {
      const { fulfillmentSlots } = await request;
      dispatch({
        type: FETCH_FULFILLMENT_SLOTS_SUCCESS,
        locationCode,
        fulfillmentSlots,
      });
    } catch (error) {
      dispatch({
        type: FETCH_FULFILLMENT_SLOTS_ERROR,
        locationCode,
      });
    }

    return request;
  };
}

export default fetchFulfillmentSlots;
