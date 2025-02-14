import {
  PipelineRequest, EAUTHENTICATION, ENOTFOUND, i18n,
} from '@shopgate/engage/core';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import { SHOPGATE_ORDER_CANCEL_ORDER } from '../constants';
import fetchOrderDetails from './fetchOrderDetails';
import { errorCancelOrder } from '../action-creators/orders';

/**
 * Cancel an order.
 * @param {Object} params Params
 * @param {number} [params.orderId] Order Id
 * @param {string} [params.orderNumber] Order Number
 * @param {string} [params.token] Request params
 * @returns {Function} A redux thunk.
 */
const cancelOrder = ({ orderId, orderNumber, token }) => async (dispatch) => {
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
          orderNumber,
          token,
        })
        .setErrorBlacklist([EAUTHENTICATION, ENOTFOUND])
        .dispatch();
      await dispatch(fetchOrderDetails({
        orderId,
        orderNumber,
        token,
      }));
    } catch (error) {
      if ([EAUTHENTICATION, ENOTFOUND].includes(error.code)) {
        dispatch(errorCancelOrder(error, {
          orderId,
          orderNumber,
        }));
        throw error;
      }
    }
  }
};

export default cancelOrder;
