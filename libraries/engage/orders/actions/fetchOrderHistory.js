import {
  PipelineRequest, EUNAUTHORIZED, EAUTHENTICATION, ENOTFOUND,
} from '@shopgate/engage/core';
import { SHOPGATE_GET_ORDER_HISTORY } from '../constants';
import { requestOrderHistory, receiveOrderHistory, errorOrderHistory } from '../action-creators';

/**
 * Fetches order history.
 * @returns {Function} A redux thunk.
 */
const fetchOrderHistory = () => (dispatch) => {
  dispatch(requestOrderHistory());

  const request = new PipelineRequest(SHOPGATE_GET_ORDER_HISTORY)
    .setInput({
      limit: 50,
      offset: 0,
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
