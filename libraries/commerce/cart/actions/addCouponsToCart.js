import { PipelineRequest, PROCESS_SEQUENTIAL, logger } from '@shopgate/pwa-core';
import * as pipelines from '../constants/Pipelines';
import addCoupons from '../action-creators/addCouponsToCart';
import errorAddCouponsToCart from '../action-creators/errorAddCouponsToCart';
import successAddCouponsToCart from '../action-creators/successAddCouponsToCart';
import { messagesHaveErrors } from '../helpers';

/**
 * Adds coupons to the cart.
 * @param {Array} couponIds The IDs of the coupons that shall be added to the cart.
 * @return {Function} A redux thunk.
 */
const addCouponsToCart = couponIds => dispatch => new Promise((resolve, reject) => {
  dispatch(addCoupons(couponIds));

  const request = new PipelineRequest(pipelines.SHOPGATE_CART_ADD_COUPONS);
  request.setInput({ couponCodes: couponIds })
    .setResponseProcessed(PROCESS_SEQUENTIAL)
    .setRetries(0)
    .dispatch()
    .then(({ messages }) => {
      if (messages && messagesHaveErrors(messages)) {
        dispatch(errorAddCouponsToCart(couponIds, messages));
        reject();
        return;
      }

      dispatch(successAddCouponsToCart(couponIds));
      resolve();
    })
    .catch((error) => {
      dispatch(errorAddCouponsToCart(couponIds));
      logger.error(pipelines.SHOPGATE_CART_ADD_COUPONS, error);
      reject();
    });
});

export default addCouponsToCart;
