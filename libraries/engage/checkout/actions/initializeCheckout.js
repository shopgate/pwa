import { LoadingProvider, PipelineRequest } from '@shopgate/engage/core';
import { CHECKOUT_PATTERN } from '../constants/routes';
import { ENTER_CHECKOUT, ENTER_CHECKOUT_SUCCESS } from '../constants/actionTypes';

/**
 * Starts entering the checkout process for the customer.
 * @returns {Function}
 */
export const initializeCheckout = () => async (dispatch) => {
  LoadingProvider.setLoading(CHECKOUT_PATTERN);
  dispatch({ type: ENTER_CHECKOUT });

  await (new PipelineRequest('shopgate.checkout.initialize').dispatch());

  dispatch({ type: ENTER_CHECKOUT_SUCCESS });
  LoadingProvider.unsetLoading(CHECKOUT_PATTERN);
};
