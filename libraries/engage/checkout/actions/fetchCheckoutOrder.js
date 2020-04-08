import { LoadingProvider, PipelineRequest } from '@shopgate/engage/core';
import { CHECKOUT_PATTERN } from '../constants/routes';
import {
  FETCH_CHECKOUT_ORDER,
  FETCH_CHECKOUT_ORDER_SUCCESS,
  FETCH_CHECKOUT_ORDER_ERROR,
} from '../constants/actionTypes';

/**
 * Starts entering the checkout process for the customer.
 * @returns {Function}
 */
export const fetchCheckoutOrder = () => async (dispatch) => {
  LoadingProvider.setLoading(CHECKOUT_PATTERN);
  dispatch({ type: FETCH_CHECKOUT_ORDER });

  const pipelineRequest = new PipelineRequest('shopgate.checkout.getOrder');
  const { order, errors } = await pipelineRequest.dispatch();

  if (errors?.length) {
    dispatch({
      type: FETCH_CHECKOUT_ORDER_ERROR,
      errors,
    });
    LoadingProvider.unsetLoading(CHECKOUT_PATTERN);
    return;
  }

  dispatch({
    type: FETCH_CHECKOUT_ORDER_SUCCESS,
    order,
  });
  LoadingProvider.unsetLoading(CHECKOUT_PATTERN);
};

