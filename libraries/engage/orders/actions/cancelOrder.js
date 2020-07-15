import {
  PipelineRequest, EUNAUTHORIZED, EAUTHENTICATION, ENOTFOUND, i18n,
} from '@shopgate/engage/core';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import { SHOPGATE_ORDER_CANCEL_ORDER } from '../constants';
import fetchOrderDetails from './fetchOrderDetails';
import { errorCancelOrder } from '../action-creators/orders';

/**
 * Cancel an order.
 * @param {string} orderId An order number
 * @param {string} token The token
 * @param {Object} [params={}] Optional params like email and phone number
 * @returns {Function} A redux thunk.
 */
const cancelOrder = (orderId, token) => async (dispatch) => {
  // Present a modal to confirm the order cancellation.
  const confirmed = await dispatch(showModal({
    title: i18n.text('order_details.cancel.modal.title'),
    message: i18n.text('order_details.cancel.modal.message'),
    confirm: i18n.text('order_details.cancel.modal.confirm'),
  }));
  if (confirmed) {
    try {
      await new PipelineRequest(SHOPGATE_ORDER_CANCEL_ORDER)
        .setInput({
          orderId,
          token,
        })
        .setErrorBlacklist([EUNAUTHORIZED, EAUTHENTICATION, ENOTFOUND])
        .dispatch();
      await dispatch(fetchOrderDetails(orderId, { token }));
    } catch (error) {
      dispatch(errorCancelOrder(error, orderId));
      throw error;
    }
  }
};

export default cancelOrder;
