import React, { useRef } from 'react';
import GuestRegistrationProvider from '../../providers/GuestRegistrationProvider';
import GuestRegistrationContent from './GuestRegistrationContent';

/**
 * The GuestRegistration component.
 * @returns {JSX}
 */
const GuestRegistration = () => {
  const formContainerRef = useRef(null);

  return (
    <GuestRegistrationProvider formContainerRef={formContainerRef}>
      <div ref={formContainerRef}>
        <GuestRegistrationContent />
      </div>
    </GuestRegistrationProvider>
  );
};
export default GuestRegistration;
