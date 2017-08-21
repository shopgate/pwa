import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import logger from '@shopgate/pwa-core/classes/Logger';
import {
  receiveCart,
  requestCart,
  errorCart,
  setCartProductPendingCount,
} from 'Library/action-creators/cart';
import {
  setViewLoading,
  unsetViewLoading,
} from 'Library/actions/view';
import { getProductPendingCount } from 'Library/selectors/cart';
import { CART_PATH } from 'Library/constants/RoutePaths';

/**
 * Get the current cart of the user.
 * @return {Function} A redux thunk.
 */
const getCart = () => (dispatch, getState) => {
  dispatch(requestCart());
  dispatch(setViewLoading(CART_PATH));

  new PipelineRequest('getCart')
    .dispatch()
    .then((response) => {
      dispatch(receiveCart(response));
    })
    .catch((error) => {
      if (error) {
        // Check if we have an error (no error means an outdated request has been rejected).
        logger.error(error);
        dispatch(errorCart());
      }
    })
    .then(() => {
      const state = getState();
      const pendingProductCount = getProductPendingCount(state);

      dispatch(setCartProductPendingCount(pendingProductCount - 1));

      dispatch(unsetViewLoading(CART_PATH));
    });
};

export default getCart;
