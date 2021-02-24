import React, { useRef } from 'react';
import { useRoute } from '@shopgate/engage/core';
import GuestRegistrationProvider from '../../providers/GuestRegistrationProvider';
import GuestCheckoutContent from './GuestRegistrationContent';

/**
 * The GuestRegistration component.
 * @returns {JSX}
 */
const GuestRegistration = () => {
  const formContainerRef = useRef(null);
  const { id } = useRoute();

  return (
    <GuestRegistrationProvider formContainerRef={formContainerRef} routeId={id}>
      <div ref={formContainerRef}>
        <GuestCheckoutContent />
      </div>
    </GuestRegistrationProvider>
  );
};

export default GuestRegistration;
