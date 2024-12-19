import { PipelineRequest } from '@shopgate/engage/core/classes';
import {
  FETCH_CUSTOMER,
  FETCH_CUSTOMER_ERROR,
  FETCH_CUSTOMER_SUCCESS,
} from '../constants';

/**
 * Starts entering the checkout process for the customer.
 * @returns {Function}
 */
export const fetchCustomerData = () => async (dispatch) => {
  dispatch({ type: FETCH_CUSTOMER });

  try {
    const { customer } = await (new PipelineRequest('shopgate.customer.getCustomer')
      .setTrusted()
      .setErrorBlacklist(['EINVALIDCALL'])
      .dispatch()
    );

    dispatch({
      type: FETCH_CUSTOMER_SUCCESS,
      customer,
    });
    return customer;
  } catch (error) {
    dispatch({
      type: FETCH_CUSTOMER_ERROR,
      error,
    });
    throw error;
  }
};
