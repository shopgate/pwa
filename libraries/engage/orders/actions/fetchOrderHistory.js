import {
  PipelineRequest, EUNAUTHORIZED, EAUTHENTICATION, ENOTFOUND,
} from '@shopgate/engage/core';
import { SHOPGATE_GET_ORDER_HISTORY } from '../constants';
import { requestOrderHistory, receiveOrderHistory, errorOrderHistory } from '../action-creators';

/**
 * Fetches order history.
 * @param {Object} params Params
 * @param {number} [params.limit] Limit
 * @param {string} [params.offset] Offset
 * @returns {Function} A redux thunk.
 */
const fetchOrderHistory = ({ limit, offset }) => (dispatch) => {
  dispatch(requestOrderHistory());

  const request = new PipelineRequest(SHOPGATE_GET_ORDER_HISTORY)
    .setInput({
      limit,
      offset,
    })
    .setErrorBlacklist([EUNAUTHORIZED, EAUTHENTICATION, ENOTFOUND])
    .dispatch();

  request
    .then((response) => {
      dispatch(receiveOrderHistory(response.orders, response.totalOrderCount));
    })
    .catch((error) => {
      dispatch(errorOrderHistory(error));
    });

  return request;
};

export default fetchOrderHistory;
