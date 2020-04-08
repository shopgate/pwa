import { LoadingProvider, PipelineRequest } from '@shopgate/engage/core';
import { CHECKOUT_PATTERN } from '../constants/routes';
import { INITIALIZE_CHECKOUT, INITIALIZE_CHECKOUT_SUCCESS } from '../constants/actionTypes';

/**
 * Starts entering the checkout process for the customer.
 * @returns {Function}
 */
export const initializeCheckout = () => async (dispatch) => {
  LoadingProvider.setLoading(CHECKOUT_PATTERN);
  dispatch({ type: INITIALIZE_CHECKOUT });

  await (new PipelineRequest('shopgate.checkout.initialize').dispatch());

  dispatch({ type: INITIALIZE_CHECKOUT_SUCCESS });
  LoadingProvider.unsetLoading(CHECKOUT_PATTERN);
};
