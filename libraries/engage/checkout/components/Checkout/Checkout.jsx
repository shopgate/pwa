import React from 'react';
import { CHECKOUT_PATTERN } from '../../constants/routes';
import CheckoutProvider from '../../providers/CheckoutProvider';
import StripeProvider from '../../providers/StripeProvider';
import PickupContactForm from './CheckoutPickupContactForm';
import Billing from './CheckoutBilling';
import CreditCard from './CheckoutCreditCard';
import Summary from './CheckoutSummary';
import Actions from './CheckoutActions';

/**
 * The Cart component.
 * @returns {JSX}
 */
const Checkout = () => (
  <StripeProvider>
    <CheckoutProvider pathPattern={CHECKOUT_PATTERN}>
      <Billing />
      <PickupContactForm />
      <CreditCard />
      <Summary />
      <Actions />
    </CheckoutProvider>
  </StripeProvider>
);

export default Checkout;
