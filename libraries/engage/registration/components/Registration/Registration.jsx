import React, { useRef } from 'react';
import RegistrationProvider from '../../providers/RegistrationProvider';
import RegistrationFormBase from './RegistrationFormBase';
import RegistrationFormShipping from './RegistrationFormShipping';
import RegistrationFormActions from './RegistrationFormActions';
import { container } from './Registration.style';

/**
 * The Registration component.
 * @returns {JSX}
 */
const Registration = () => {
  const formContainerRef = useRef(null);

  return (
    <RegistrationProvider formContainerRef={formContainerRef}>
      <div className={container} ref={formContainerRef}>
        <RegistrationFormBase />
        <RegistrationFormShipping />
      </div>
      <RegistrationFormActions />
    </RegistrationProvider>
  );
};

export default Registration;
