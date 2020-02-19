import { PipelineRequest, logger } from '@shopgate/engage/core';
import { fetchCart } from '@shopgate/pwa-common-commerce/cart';
import {
  submitReservationRequest,
  submitReservationSuccess,
  submitReservationError,
} from '../action-creators';
import { SHOPGATE_STOREFRONT_CREATE_ORDER } from '../constants';
import { createOrder } from '../helpers';

/**
 * @param {Object} values The user order.
 * @param {Object} product The current product
 * @returns {Function} A redux thunk.
 */
function submitReservation(values, product) {
  return (dispatch, getState) => {
    dispatch(submitReservationRequest(values));

    const order = createOrder(values, product, getState);

    const request = new PipelineRequest(SHOPGATE_STOREFRONT_CREATE_ORDER)
      .setInput({ orders: [order] })
      .dispatch();

    request
      .then((result) => {
        if (result.errors && result.errors.length > 0) {
          logger.error(result.errors);
          dispatch(submitReservationError(result.errors));
          return result;
        }

        if (product === null) {
          dispatch(fetchCart());
        }

        dispatch(submitReservationSuccess(result.orderNumbers));
        return result;
      })
      .catch((error) => {
        logger.error(error);
        dispatch(submitReservationError([error]));
        return error;
      });

    return request;
  };
}

export default submitReservation;
