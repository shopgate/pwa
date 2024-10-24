import { PipelineRequest } from '@shopgate/engage/core/classes';
import {
  FETCH_CUSTOMER_CONTACTS,
  FETCH_CUSTOMER_CONTACTS_SUCCESS,
  FETCH_CUSTOMER_CONTACTS_ERROR,
} from '../constants/actions';

/**
 * Starts entering the checkout process for the customer.
 * @returns {Function}
 */
export const fetchCustomerContacts = () => async (dispatch) => {
  dispatch({ type: FETCH_CUSTOMER_CONTACTS });

  try {
    const { contacts } = await (new PipelineRequest('shopgate.customer.getContacts')
      .setTrusted()
      .dispatch()
    );

    dispatch({
      type: FETCH_CUSTOMER_CONTACTS_SUCCESS,
      contacts,
    });
    return contacts;
  } catch (error) {
    dispatch({
      type: FETCH_CUSTOMER_CONTACTS_ERROR,
      error,
    });
    throw error;
  }
};
