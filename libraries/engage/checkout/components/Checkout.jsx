import React from 'react';
import CheckoutProvider from '../providers/CheckoutProvider';
import StripeProvider from '../providers/StripeProvider';
import PickupContactForm from './PickupContactForm';
import Billing from './Billing';
import CreditCard from './CreditCard';
import Summary from './Summary';
import Actions from './Actions';

/**
 * The Cart component.
 * @returns {JSX}
 */
const Checkout = () => (
  <StripeProvider>
    <CheckoutProvider>
      <Billing />
      <PickupContactForm />
      <CreditCard />
      <Summary />
      <Actions />
    </CheckoutProvider>
  </StripeProvider>
);

export default Checkout;
