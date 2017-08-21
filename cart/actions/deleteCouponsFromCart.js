import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import logger from '@shopgate/pwa-core/classes/Logger';
import {
  deleteCouponsFromCart as deleteCoupons,
  errorDeleteCouponsFromCart,
  successDeleteCouponsFromCart,
} from '../action-creators';

/**
 * Deletes coupons from the cart.
 * @param {Array} couponIds The IDs of the coupons that shall be deleted from the cart.
 * @return {Function} A redux thunk.
 */
const deleteCouponsFromCart = couponIds => (dispatch) => {
  dispatch(deleteCoupons(couponIds));

  new PipelineRequest('deleteCouponsFromCart')
    .setInput({ couponCodes: couponIds })
    .dispatch()
    .then(({ messages }) => {
      dispatch(successDeleteCouponsFromCart());

      if (messages) {
        dispatch(errorDeleteCouponsFromCart(couponIds, messages));
      }
    })
    .catch((error) => {
      dispatch(errorDeleteCouponsFromCart(couponIds));
      logger.error('deleteCouponsFromCart', error);
    });
};

export default deleteCouponsFromCart;
