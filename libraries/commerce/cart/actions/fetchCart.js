import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { PROCESS_LAST } from '@shopgate/pwa-core/constants/ProcessTypes';
import { logger } from '@shopgate/pwa-core/helpers';
import { mutable } from '@shopgate/pwa-common/helpers/redux';
import * as pipelines from '../constants/Pipelines';
import receiveCart from '../action-creators/receiveCart';
import requestCart from '../action-creators/requestCart';
import errorCart from '../action-creators/errorCart';
import { getIsFetching } from '../selectors/index';

/**
 * Get the current cart of the user. The promise resolves with "undefined" when the fetch was
 * blocked by a dependency.
 * @return {Function} A redux thunk.
 */
const fetchCart = () => (dispatch, getState) => {
  const request = new PipelineRequest(pipelines.SHOPGATE_CART_GET_CART)
    .setResponseProcessed(PROCESS_LAST);

  /**
   * To avoid unnecessarily dispatched getCart requests, the request is only sent when
   * no cart modifying requests are currently running.
   * If any of the dependencies change the cart, they need to fetch the new data afterwards.
   * The getCart action is not a dependency to itself, so sending out a getCart while another one
   * is running is a valid case, because this pipeline is set up to process the last result only!
   */
  if (request.hasRunningDependencies()) {
    return undefined;
  }

  dispatch(requestCart());

  const result = request.dispatch();
  result
    // Dispatch "receiveCart" only when the cart is still fetching (in case of stacked fetch calls)
    .then(response => getIsFetching(getState()) && dispatch(receiveCart(response)))
    .catch((error) => {
      if (error) {
        // Post only one error in a group of possibly multiple requests being rejected at once
        if (!getIsFetching(getState())) {
          return;
        }

        // Check if we have an error (no error means an outdated request has been rejected).
        logger.error(error);
        dispatch(errorCart());
      }
    });
  return result;
};

/** @mixes {MutableFunction} */
export default mutable(fetchCart);
