import { PipelineRequest } from '@shopgate/engage/core';
import {
  UPDATE_CHECKOUT_ORDER,
  UPDATE_CHECKOUT_ORDER_SUCCESS,
  UPDATE_CHECKOUT_ORDER_ERROR,
} from '../constants/actionTypes';
import { ERROR_CODE_CHECKOUT_GENERIC } from '../constants/errorCodes';
import { errorCheckout } from './errorCheckout';

/**
 * Starts entering the checkout process for the customer.
 * @param {Object} payload Order payload.
 * @returns {Function}
 */
export const updateCheckoutOrder = payload => async (dispatch) => {
  dispatch({ type: UPDATE_CHECKOUT_ORDER });

  let pipelineError;
  try {
    await (new PipelineRequest('shopgate.checkout.updateOrder')
      .setInput(payload)
      .setErrorBlacklist([ERROR_CODE_CHECKOUT_GENERIC])
      .dispatch());
    dispatch({ type: UPDATE_CHECKOUT_ORDER_SUCCESS });
  } catch (error) {
    pipelineError = error;
    dispatch(errorCheckout(
      'checkout.errors.genericUpdate',
      'shopgate.checkout.updateOrder',
      error,
      false
    ));
    dispatch({ type: UPDATE_CHECKOUT_ORDER_ERROR });
  }

  if (pipelineError) {
    throw pipelineError;
  }
};

