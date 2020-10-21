import { PipelineRequest, EUNKNOWN } from '@shopgate/engage/core';
import { INITIALIZE_CHECKOUT, INITIALIZE_CHECKOUT_SUCCESS, INITIALIZE_CHECKOUT_ERROR } from '../constants/actionTypes';

/**
 * Starts entering the checkout process for the customer.
 * @returns {Function}
 */
export const initializeCheckout = () => async (dispatch) => {
  dispatch({ type: INITIALIZE_CHECKOUT });

  let pipelineError;
  try {
    await (new PipelineRequest('shopgate.checkout.initialize')
      .setErrorBlacklist([EUNKNOWN])
      .dispatch()
    );
    dispatch({ type: INITIALIZE_CHECKOUT_SUCCESS });
  } catch (error) {
    pipelineError = error;
    dispatch({
      type: INITIALIZE_CHECKOUT_ERROR,
      error,
    });
  }

  if (pipelineError) {
    throw pipelineError;
  }
};
