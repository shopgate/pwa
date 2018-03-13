import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import receiveCart from '../action-creators/receiveCart';
import requestCart from '../action-creators/requestCart';
import errorCart from '../action-creators/errorCart';

/**
 * Get the current cart of the user.
 * @return {Function} A redux thunk.
 */
const fetchCart = () => (dispatch) => {
  dispatch(requestCart());

  new PipelineRequest('getCart')
    .dispatch()
    .then(response => dispatch(receiveCart(response)))
    .catch((error) => {
      if (error) {
        // Check if we have an error (no error means an outdated request has been rejected).
        logger.error(error);
        dispatch(errorCart());
      }
    });
};

export default fetchCart;
