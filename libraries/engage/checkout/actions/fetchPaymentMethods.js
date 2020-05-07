import { LoadingProvider, PipelineRequest } from '@shopgate/engage/core';
import { CHECKOUT_PATTERN } from '../constants/routes';
import {
  FETCH_PAYMENT_METHODS,
  FETCH_PAYMENT_METHODS_SUCCESS,
  FETCH_PAYMENT_METHODS_ERROR,
} from '../constants/actionTypes';

/**
 * Starts entering the checkout process for the customer.
 * @returns {Function}
 */
export const fetchPaymentMethods = () => async (dispatch) => {
  LoadingProvider.setLoading(CHECKOUT_PATTERN);
  dispatch({ type: FETCH_PAYMENT_METHODS });

  const pipelineRequest = new PipelineRequest('shopgate.checkout.getPaymentMethods');

  try {
    const { paymentMethods } = await pipelineRequest.dispatch();

    dispatch({
      type: FETCH_PAYMENT_METHODS_SUCCESS,
      paymentMethods,
    });
    LoadingProvider.unsetLoading(CHECKOUT_PATTERN);
  } catch (error) {
    dispatch({
      type: FETCH_PAYMENT_METHODS_ERROR,
      error,
    });
    LoadingProvider.unsetLoading(CHECKOUT_PATTERN);
  }
};

