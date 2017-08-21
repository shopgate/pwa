import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import logger from '@shopgate/pwa-core/classes/Logger';
import {
  deleteCouponsFromCart as deleteCoupons,
  errorDeleteCouponsFromCart,
  successDeleteCouponsFromCart,
} from 'Library/action-creators/cart';
import { processMessages } from 'Library/actions/cart';
import {
  setViewLoading,
  unsetViewLoading,
} from 'Library/actions/view';
import { CART_PATH } from 'Library/constants/RoutePaths';

/**
 * Deletes coupons from the cart.
 * @param {Array} couponIds The IDs of the coupons that shall be deleted from the cart.
 * @return {Function} A redux thunk.
 */
const deleteCouponsFromCart = couponIds => (dispatch) => {
  dispatch(setViewLoading(CART_PATH));
  dispatch(deleteCoupons(couponIds));

  new PipelineRequest('deleteCouponsFromCart')
    .setInput({ couponCodes: couponIds })
    .dispatch()
    .then(({ messages }) => {
      dispatch(successDeleteCouponsFromCart());

      if (messages) {
        dispatch(errorDeleteCouponsFromCart(couponIds, messages));
        processMessages(dispatch, messages, 'deleteCouponsFromCart');
      }
    })
    .catch((error) => {
      dispatch(errorDeleteCouponsFromCart(couponIds));
      logger.error('deleteCouponsFromCart', error);
    })
    .then(() => {
      dispatch(unsetViewLoading(CART_PATH));
    });
};

export default deleteCouponsFromCart;
