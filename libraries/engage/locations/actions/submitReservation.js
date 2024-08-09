import { logger } from '@shopgate/pwa-core/helpers';
import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { mutable } from '@shopgate/pwa-common/helpers/redux';
import {
  submitReservationRequest,
  submitReservationSuccess,
  submitReservationError,
} from '../action-creators';
import { SHOPGATE_STOREFRONT_CREATE_ORDER } from '../constants';
import createOrder from '../helpers/createOrder';

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

/** @mixes {MutableFunction} */
export default mutable(submitReservation);
