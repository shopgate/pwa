import { PipelineRequest } from '@shopgate/engage/core';
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
  dispatch({ type: FETCH_PAYMENT_METHODS });

  const pipelineRequest = new PipelineRequest('shopgate.checkout.getPaymentMethods');

  try {
    const { paymentMethods } = await pipelineRequest.dispatch();

    dispatch({
      type: FETCH_PAYMENT_METHODS_SUCCESS,
      paymentMethods,
    });
  } catch (error) {
    dispatch({
      type: FETCH_PAYMENT_METHODS_ERROR,
      error,
    });
  }
};

