import { PipelineRequest } from '@shopgate/engage/core/classes';
import {
  UPDATE_CUSTOMER,
  UPDATE_CUSTOMER_SUCCESS,
  UPDATE_CUSTOMER_ERROR,
} from '../constants/actions';

/**
 * @param {Object} customer Customer
 * @returns {Function}
 */
export const updateCustomerData = customer => async (dispatch) => {
  dispatch({
    type: UPDATE_CUSTOMER,
    customer,
  });

  try {
    await (new PipelineRequest('shopgate.customer.updateCustomer')
      .setInput({ customer })
      .setTrusted()
      .dispatch()
    );

    dispatch({
      type: UPDATE_CUSTOMER_SUCCESS,
      customer,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_CUSTOMER_ERROR,
      customer,
      error,
    });
    throw error;
  }
};
