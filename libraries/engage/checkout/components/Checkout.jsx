import React from 'react';
import CheckoutProvider from '../providers/CheckoutProvider';
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
  <CheckoutProvider>
    <PickupContactForm />
    <Billing />
    <CreditCard />
    <Summary />
    <Actions />
  </CheckoutProvider>
);

export default Checkout;
