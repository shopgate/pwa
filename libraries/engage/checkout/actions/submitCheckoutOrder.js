import { PipelineRequest, LoadingProvider } from '@shopgate/engage/core';
import { CHECKOUT_PATTERN } from '../constants/routes';
import {
  SUBMIT_CHECKOUT_ORDER,
  SUBMIT_CHECKOUT_ORDER_SUCCESS,
  SUBMIT_CHECKOUT_ORDER_ERROR,
} from '../constants/actionTypes';
import { ERROR_CODE_CHECKOUT_GENERIC } from '../constants/errorCodes';
import { errorCheckout } from './errorCheckout';

/**
 * Completes the checkout order by fulfilling with checkout params for each transaction.
 * @param {Object} payload The action input.
 * @returns {Function}
 */
export const submitCheckoutOrder = payload => async (dispatch) => {
  LoadingProvider.setLoading(CHECKOUT_PATTERN);
  dispatch({
    type: SUBMIT_CHECKOUT_ORDER,
    payload,
  });

  let pipelineError;
  try {
    await (new PipelineRequest('shopgate.checkout.submit')
      .setInput(payload)
      .setErrorBlacklist([ERROR_CODE_CHECKOUT_GENERIC])
      .dispatch());

    dispatch({ type: SUBMIT_CHECKOUT_ORDER_SUCCESS });
  } catch (error) {
    pipelineError = error;
    dispatch(errorCheckout(
      'checkout.errors.genericSubmit',
      'shopgate.checkout.submit',
      error,
      false
    ));
    dispatch({ type: SUBMIT_CHECKOUT_ORDER_ERROR });
  }

  LoadingProvider.unsetLoading(CHECKOUT_PATTERN);

  if (pipelineError) {
    throw pipelineError;
  }
};

