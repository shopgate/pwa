import {
  PipelineRequest, EUNAUTHORIZED, EAUTHENTICATION, ENOTFOUND,
} from '@shopgate/engage/core';
import { SHOPGATE_ORDER_GET_ORDER_DETAILS } from '../constants';
import { requestOrderDetails, receiveOrderDetails, errorOrderDetails } from '../action-creators';

/**
 * Fetches details of an order.
 * @param {Object} [params={}] Optional params like email and phone number
 * @returns {Function} A redux thunk.
 */
const fetchOrderDetails = (params = {}) => (dispatch) => {
  dispatch(requestOrderDetails(params));

  const request = new PipelineRequest(SHOPGATE_ORDER_GET_ORDER_DETAILS)
    .setInput(params)
    .setErrorBlacklist([EUNAUTHORIZED, EAUTHENTICATION, ENOTFOUND])
    .dispatch();

  request
    .then((response) => {
      dispatch(receiveOrderDetails(params, response.order));
    })
    .catch((error) => {
      dispatch(errorOrderDetails(error, params));
    });

  return request;
};

export default fetchOrderDetails;
