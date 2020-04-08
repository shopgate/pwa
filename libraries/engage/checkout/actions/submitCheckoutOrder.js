import { PipelineRequest, LoadingProvider } from '@shopgate/engage/core';
import { CHECKOUT_PATTERN } from '../constants/routes';
import { SUBMIT_CHECKOUT_ORDER, SUBMIT_CHECKOUT_ORDER_SUCCESS } from '../constants/actionTypes';

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

  await (new PipelineRequest('shopgate.checkout.submit')
    .setInput(payload)
    .dispatch());

  dispatch({ type: SUBMIT_CHECKOUT_ORDER_SUCCESS });
  LoadingProvider.unsetLoading(CHECKOUT_PATTERN);
};

