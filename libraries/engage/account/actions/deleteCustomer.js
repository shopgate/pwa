import { PipelineRequest } from '@shopgate/engage/core/classes';
import { successLogout } from '@shopgate/pwa-common/action-creators/user';
import {
  DELETE_CUSTOMER,
  DELETE_CUSTOMER_SUCCESS,
  DELETE_CUSTOMER_ERROR,
} from '../constants/actions';

/**
 * Starts entering the checkout process for the customer.
 * @returns {Function}
 */
export const deleteCustomer = () => async (dispatch) => {
  dispatch({ type: DELETE_CUSTOMER });

  try {
    await (new PipelineRequest('shopgate.customer.deleteCustomer')
      .setTrusted()
      .dispatch()
    );

    dispatch({ type: DELETE_CUSTOMER_SUCCESS });
    dispatch(successLogout(false));
  } catch (error) {
    dispatch({
      type: DELETE_CUSTOMER_ERROR,
      error,
    });
    throw error;
  }
};
