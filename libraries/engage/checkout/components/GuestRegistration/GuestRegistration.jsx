import React from 'react';
import GuestRegistrationProvider from '../../providers/GuestRegistrationProvider';
import GuestRegistrationContent from './GuestRegistrationContent';

/**
 * The GuestRegistration component.
 * @returns {JSX}
 */
const GuestRegistration = () => (
  <GuestRegistrationProvider>
    <GuestRegistrationContent />
  </GuestRegistrationProvider>
);

export default GuestRegistration;
