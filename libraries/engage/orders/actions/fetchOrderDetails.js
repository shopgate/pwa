import {
  PipelineRequest, EUNAUTHORIZED, EAUTHENTICATION, ENOTFOUND,
} from '@shopgate/engage/core';
import { SHOPGATE_ORDER_GET_ORDER_DETAILS } from '../constants';
import { requestOrderDetails, receiveOrderDetails, errorOrderDetails } from '../action-creators';

/**
 * Fetches details of an order.
 * @param {string} orderId An order number
 * @param {Object} [params={}] Optional params like email and phone number
 * @returns {Function} A redux thunk.
 */
const fetchOrderDetails = (orderId, params = {}) => (dispatch) => {
  dispatch(requestOrderDetails(orderId, params));

  const { email, phone } = params;

  const request = new PipelineRequest(SHOPGATE_ORDER_GET_ORDER_DETAILS)
    .setInput({
      orderId,
      email,
      phone,
    })
    .setErrorBlacklist([EUNAUTHORIZED, EAUTHENTICATION, ENOTFOUND])
    .dispatch();

  request
    .then((response) => {
      dispatch(receiveOrderDetails(orderId, response.order));
    })
    .catch((error) => {
      dispatch(errorOrderDetails(error, orderId, params));
    });

  return request;
};

export default fetchOrderDetails;
