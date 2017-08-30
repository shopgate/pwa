import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import {
  addCouponsToCart as addCoupons,
  errorAddCouponsToCart,
  successAddCouponsToCart,
} from '../action-creators';

/**
 * Adds coupons to the cart.
 * @param {Array} couponIds The IDs of the coupons that shall be added to the cart.
 * @return {Function} A redux thunk.
 */
const addCouponsToCart = couponIds => dispatch => (
  new Promise((resolve, reject) => {
    dispatch(addCoupons(couponIds));

    new PipelineRequest('addCouponsToCart')
      .setInput({ couponCodes: couponIds })
      .dispatch()
      .then(({ messages }) => {
        if (messages) {
          dispatch(errorAddCouponsToCart(couponIds, messages));
          reject();
        } else {
          dispatch(successAddCouponsToCart(couponIds));
          resolve();
        }
      })
      .catch((error) => {
        dispatch(errorAddCouponsToCart(couponIds));
        logger.error('addCouponsToCart', error);
        reject();
      });
  })
);

export default addCouponsToCart;
