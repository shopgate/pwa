import { LoadingProvider, PipelineRequest } from '@shopgate/engage/core';
import { CHECKOUT_PATTERN } from '../constants/routes';
import { FETCH_PAYMENT_METHODS, FETCH_PAYMENT_METHODS_SUCCESS } from '../constants/actionTypes';

/**
 * Starts entering the checkout process for the customer.
 * @returns {Function}
 */
export const fetchPaymentMethods = () => async (dispatch) => {
  LoadingProvider.setLoading(CHECKOUT_PATTERN);
  dispatch({ type: FETCH_PAYMENT_METHODS });

  const pipelineRequest = new PipelineRequest('shopgate.checkout.getPaymentMethods');
  const { paymentMethods } = await pipelineRequest.dispatch();

  dispatch({
    type: FETCH_PAYMENT_METHODS_SUCCESS,
    paymentMethods,
  });
  LoadingProvider.unsetLoading(CHECKOUT_PATTERN);
};

