import { PipelineRequest } from '@shopgate/engage/core/classes';
import {
  ADD_CUSTOMER_CONTACT,
  ADD_CUSTOMER_CONTACT_SUCCESS,
  ADD_CUSTOMER_CONTACT_ERROR,
} from '../constants/actions';

/**
 * Starts entering the checkout process for the customer.
 * @returns {Function}
 */
export const addCustomerContacts = ({ contacts }) => async (dispatch) => {
  dispatch({
    type: ADD_CUSTOMER_CONTACT,
    contacts,
  });

  let response;

  try {
    response = await (new PipelineRequest('shopgate.customer.addContacts')
      .setTrusted()
      .setInput({
        contacts,
      })
      .dispatch()
    );

    dispatch({
      type: ADD_CUSTOMER_CONTACT_SUCCESS,
      contacts,
    });
  } catch (error) {
    dispatch({
      type: ADD_CUSTOMER_CONTACT_ERROR,
      contacts,
      error,
    });
    throw error;
  }

  return response;
};
