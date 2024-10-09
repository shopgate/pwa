import { PipelineRequest } from '@shopgate/engage/core/classes';
import {
  DELETE_CUSTOMER_CONTACT,
  DELETE_CUSTOMER_CONTACT_SUCCESS,
  DELETE_CUSTOMER_CONTACT_ERROR,
} from '../constants/actions';

/**
 * Starts entering the checkout process for the customer.
 * @param {Object} contactId Contact
 * @returns {Function}
 */
export const deleteCustomerContact = contactId => async (dispatch) => {
  dispatch({ type: DELETE_CUSTOMER_CONTACT });

  try {
    await (new PipelineRequest('shopgate.customer.deleteContact')
      .setInput({ contactId })
      .setTrusted()
      .dispatch()
    );

    dispatch({
      type: DELETE_CUSTOMER_CONTACT_SUCCESS,
      contactId,
    });
  } catch (error) {
    dispatch({
      type: DELETE_CUSTOMER_CONTACT_ERROR,
      error,
    });
    throw error;
  }
};
