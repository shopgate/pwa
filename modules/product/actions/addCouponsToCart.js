import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import logger from '@shopgate/pwa-core/classes/Logger';
import {
  addCouponsToCart as addCoupons,
  errorAddCouponsToCart,
  successAddCouponsToCart,
} from 'Library/action-creators/cart';
import { processMessages } from 'Library/actions/cart';
import {
  setViewLoading,
  unsetViewLoading,
} from 'Library/actions/view';
import { CART_PATH } from 'Library/constants/RoutePaths';

/**
 * Adds coupons to the cart.
 * @param {Array} couponIds The IDs of the coupons that shall be added to the cart.
 * @return {Function} A redux thunk.
 */
const addCouponsToCart = couponIds => dispatch => (
  new Promise((resolve, reject) => {
    dispatch(setViewLoading(CART_PATH));
    dispatch(addCoupons(couponIds));

    new PipelineRequest('addCouponsToCart')
      .setInput({ couponCodes: couponIds })
      .dispatch()
      .then(({ messages }) => {
        if (messages) {
          dispatch(errorAddCouponsToCart(couponIds, messages));
          processMessages(dispatch, messages, 'addCouponsToCart');
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
      })
      .then(() => {
        dispatch(unsetViewLoading(CART_PATH));
      });
  })
);

export default addCouponsToCart;
