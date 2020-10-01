import {
  PipelineRequest, EUNAUTHORIZED, EAUTHENTICATION, ENOTFOUND,
} from '@shopgate/engage/core';
import { SHOPGATE_ORDER_GET_ORDER_DETAILS } from '../constants';
import { requestOrderDetails, receiveOrderDetails, errorOrderDetails } from '../action-creators';

/**
 * Fetches details of an order.
 * @param {Object} params Params
 * @param {number} [params.orderId] Order Id
 * @param {string} [params.orderNumber] Order Number
 * @param {string} [params.email] Email
 * @param {string} [params.phone] Phone Number
 * @param {string} [params.token] Request params
 * @returns {Function} A redux thunk.
 */
const fetchOrderDetails = (params = {}) => async (dispatch) => {
  dispatch(requestOrderDetails(params));

  const request = new PipelineRequest(SHOPGATE_ORDER_GET_ORDER_DETAILS)
    .setInput(params)
    .setErrorBlacklist([EUNAUTHORIZED, EAUTHENTICATION, ENOTFOUND])
    .dispatch();

  try {
    const response = await request;
    dispatch(receiveOrderDetails(params, response.order));
    return response.order;
  } catch (error) {
    dispatch(errorOrderDetails(error, params));
    return null;
  }
};

export default fetchOrderDetails;
