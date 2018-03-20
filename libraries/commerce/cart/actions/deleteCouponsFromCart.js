import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import deleteCoupons from '../action-creators/deleteCouponsFromCart';
import errorDeleteCouponsFromCart from '../action-creators/errorDeleteCouponsFromCart';
import successDeleteCouponsFromCart from '../action-creators/successDeleteCouponsFromCart';
import { messagesHaveErrors } from '../helpers';

/**
 * Deletes coupons from the cart.
 * @param {Array} couponIds The IDs of the coupons that shall be deleted from the cart.
 * @return {Function} A redux thunk.
 */
const deleteCouponsFromCart = couponIds => (dispatch) => {
  dispatch(deleteCoupons(couponIds));

  const request = new PipelineRequest('shopgate.cart.deleteCouponsFromCart');
  request.setInput({ couponCodes: couponIds })
    .dispatch()
    .then(({ messages }) => {
      const requestsPending = request.hasPendingRequests();

      if (messagesHaveErrors(messages)) {
        dispatch(errorDeleteCouponsFromCart(couponIds, messages, requestsPending));
        return;
      }

      dispatch(successDeleteCouponsFromCart(requestsPending));
    })
    .catch((error) => {
      const requestsPending = request.hasPendingRequests();
      dispatch(errorDeleteCouponsFromCart(couponIds, undefined, requestsPending));
      logger.error('deleteCouponsFromCart', error);
    });
};

export default deleteCouponsFromCart;
