import React, { useRef } from 'react';
import RegistrationProvider from '../../providers/RegistrationProvider';
import RegistrationFormBase from './RegistrationFormBase';
import RegistrationFormBilling from './RegistrationFormBilling';
import RegistrationFormShipping from './RegistrationFormShipping';
import RegistrationFormActions from './RegistrationFormActions';
import RegistrationFormExtra from './RegistrationFormExtra';
import RegistrationFormToggle from './RegistrationFormToggle';
import { container, containerItem } from './Registration.style';

/**
 * The Registration component.
 * @returns {JSX}
 */
const Registration = () => {
  const formContainerRef = useRef(null);

  return (
    <RegistrationProvider formContainerRef={formContainerRef}>
      <div className={container} ref={formContainerRef}>
        <div className={containerItem}>
          <RegistrationFormBase />
        </div>
        <div className={containerItem}>
          <RegistrationFormBilling />
          <RegistrationFormToggle />
          <RegistrationFormShipping />
          <RegistrationFormExtra />
        </div>
      </div>
      <RegistrationFormActions />
    </RegistrationProvider>
  );
};

export default Registration;
