import React from 'react';
import PickupForm from './GuestRegistrationPickupForm';
import BillingForm from './GuestRegistrationBillingForm';
import Actions from './GuestRegistrationActions';
import GuestRegistrationProvider from '../../providers/GuestRegistrationProvider';

/**
 * The GuestRegistration component.
 * @returns {JSX}
 */
const GuestRegistration = () => (
  <GuestRegistrationProvider>
    <BillingForm />
    <PickupForm />
    <Actions />
  </GuestRegistrationProvider>
);

export default GuestRegistration;
