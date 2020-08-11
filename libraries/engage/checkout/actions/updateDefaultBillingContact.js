import { LoadingProvider } from '@shopgate/engage/core';
import { getCheckoutOrder } from '@shopgate/engage/checkout/selectors/order';
import { CHECKOUT_BILLING_PATTERN } from '../constants/routes';
import { updateCheckoutOrder } from './updateCheckoutOrder';
import { fetchCustomerContacts } from '../../account/actions/fetchContacts';
import { updateCustomerContact } from '../../account/actions/updateContact';
import { errorCheckout } from './errorCheckout';

/**
 * @param {Object} contact Contact
 * @returns {JSX}
 * */
const sanitizeContact = contact => ({
  firstName: contact.firstName,
  lastName: contact.lastName,
  mobile: contact.mobile,
  emailAddress: contact.emailAddress,
  company: contact.company || undefined,
  address1: contact.address1,
  address2: contact.address2 || undefined,
  country: contact.country,
  postalCode: contact.postalCode,
  city: contact.city,
  region: contact.region,
});

/**
 * Updates the customers default billing contact.
 * @param {Object} contact The new contact for billing.
 * @returns {Function}
 */
export const updateDefaultBillingContact = ({ contact }) => async (dispatch, getState) => {
  LoadingProvider.setLoading(CHECKOUT_BILLING_PATTERN);

  // Update billing address in checkout order.
  try {
    const order = getCheckoutOrder(getState());
    await dispatch(updateCheckoutOrder({
      addressSequences: order.addressSequences.map(
        (address, index) => (index === order.primaryBillToAddressSequenceIndex ? {
          type: 'billing',
          ...sanitizeContact(contact),
        } : address)
      ),
    }));
  } catch (error) {
    LoadingProvider.resetLoading(CHECKOUT_BILLING_PATTERN);
    return false;
  }

  // Update default billing contact.
  try {
    const contacts = await dispatch(fetchCustomerContacts());
    const billingContact = contacts?.find?.(c => c.isDefaultBilling);
    if (billingContact) {
      await dispatch(updateCustomerContact({
        contactId: billingContact.id,
        contact: {
          ...sanitizeContact(contact),
          isDefaultBilling: true,
        },
      }));
    }
  } catch (error) {
    LoadingProvider.resetLoading(CHECKOUT_BILLING_PATTERN);
    dispatch(errorCheckout(
      'checkout.errors.genericUpdateBilling',
      'shopgate.customer.updateContact.v1',
      error,
      false
    ));
    return false;
  }

  // Successful.
  LoadingProvider.resetLoading(CHECKOUT_BILLING_PATTERN);
  return true;
};
