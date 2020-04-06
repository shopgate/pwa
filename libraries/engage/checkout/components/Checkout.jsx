import React from 'react';
import CheckoutProvider from '../providers/CheckoutProvider';
import PickupContactForm from './PickupContactForm';

/**
 * The Cart component.
 * @returns {JSX}
 */
const Checkout = () => (
  <CheckoutProvider>
    <PickupContactForm />
  </CheckoutProvider>
);

export default Checkout;
