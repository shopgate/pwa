import { LoadingProvider } from '@shopgate/engage/core';
import { CHECKOUT_PATTERN } from '../constants/routes';
import { ENTER_CHECKOUT, ENTER_CHECKOUT_SUCCESS } from '../constants/actionTypes';

/**
 * Starts entering the checkout process for the customer.
 * @returns {Function}
 */
export const updateCheckoutOrder = () => async (dispatch) => {
  LoadingProvider.setLoading(CHECKOUT_PATTERN);
  // dispatch({ type: ENTER_CHECKOUT });

  // TODO: order creation here (if omnichannel checkout is enabled)
  await new Promise(resolve => setTimeout(resolve, 5000));

  // dispatch({ type: ENTER_CHECKOUT_SUCCESS });
  LoadingProvider.unsetLoading(CHECKOUT_PATTERN);
};

