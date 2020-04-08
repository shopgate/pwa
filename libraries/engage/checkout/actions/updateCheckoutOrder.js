import { PipelineRequest, LoadingProvider } from '@shopgate/engage/core';
import { CHECKOUT_PATTERN } from '../constants/routes';
import { UPDATE_CHECKOUT_ORDER, UPDATE_CHECKOUT_ORDER_SUCCESS } from '../constants/actionTypes';

/**
 * Starts entering the checkout process for the customer.
 * @param {Object} payload Order payload.
 * @returns {Function}
 */
export const updateCheckoutOrder = payload => async (dispatch) => {
  LoadingProvider.setLoading(CHECKOUT_PATTERN);
  dispatch({ type: UPDATE_CHECKOUT_ORDER });

  await (new PipelineRequest('shopgate.checkout.updateOrder')
    .setInput(payload)
    .dispatch());

  dispatch({ type: UPDATE_CHECKOUT_ORDER_SUCCESS });
  LoadingProvider.unsetLoading(CHECKOUT_PATTERN);
};

