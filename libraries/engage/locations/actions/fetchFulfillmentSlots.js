import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { mutable } from '@shopgate/pwa-common/helpers/redux';
import {
  FETCH_FULFILLMENT_SLOTS_ERROR,
  FETCH_FULFILLMENT_SLOTS_SUCCESS,
} from '../constants/ActionTypes';

/**
 * Fetches fulfillment slots of a location
 * @param {Object} params Function params
 * @param {string} params.locationCode A location code
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

/** @mixes {MutableFunction} */
export default mutable(fetchFulfillmentSlots);
