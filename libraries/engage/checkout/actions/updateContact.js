import { PipelineRequest } from '@shopgate/engage/core';
import {
  UPDATE_CUSTOMER_CONTACT,
  UPDATE_CUSTOMER_CONTACT_SUCCESS,
  UPDATE_CUSTOMER_CONTACT_ERROR,
} from '../constants/actionTypes';

/**
 * Starts entering the checkout process for the customer.
 * @returns {Function}
 */
export const updateCustomerContact = ({ contactId, contact }) => async (dispatch) => {
  dispatch({
    type: UPDATE_CUSTOMER_CONTACT,
    contactId,
    contact,
  });

  try {
    await (new PipelineRequest('shopgate.customer.updateContact')
      .setTrusted()
      .setInput({
        contactId,
        contact,
      })
      .dispatch()
    );

    dispatch({
      type: UPDATE_CUSTOMER_CONTACT_SUCCESS,
      contactId,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_CUSTOMER_CONTACT_ERROR,
      contactId,
      error,
    });
    throw error;
  }
};
