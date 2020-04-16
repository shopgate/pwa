import React from 'react';
import { GUEST_CHECKOUT_PAYMENT_PATTERN } from '../../constants/routes';
import CheckoutProvider from '../../providers/CheckoutProvider';
import StripeProvider from '../../providers/StripeProvider';
import Billing from '../Checkout/CheckoutBilling';
import CreditCard from '../Checkout/CheckoutCreditCard';
import Summary from '../Checkout/CheckoutSummary';
import Actions from '../Checkout/CheckoutActions';
import Pickup from './GuestRegistrationPickup';

/**
 * The Cart component.
 * @returns {JSX}
 */
const GuestCheckoutPayment = () => (
  <StripeProvider>
    <CheckoutProvider
      pathPattern={GUEST_CHECKOUT_PAYMENT_PATTERN}
      orderInitialized
      orderReadOnly
    >
      <Pickup />
      <Billing />
      <CreditCard />
      <Summary />
      <Actions />
    </CheckoutProvider>
  </StripeProvider>
);

export default GuestCheckoutPayment;

