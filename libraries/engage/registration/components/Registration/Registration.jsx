import React, { useRef } from 'react';
import RegistrationProvider from '../../providers/RegistrationProvider';
import RegistrationContent from './RegistrationContent';

/**
 * The Registration component.
 * @returns {JSX}
 */
const Registration = () => {
  const formContainerRef = useRef(null);

  return (
    <RegistrationProvider formContainerRef={formContainerRef}>
      <RegistrationContent ref={formContainerRef} />
    </RegistrationProvider>
  );
};

export default Registration;
