import React from 'react';
import RegistrationProvider from '../../providers/RegistrationProvider';
import RegistrationFormBase from './RegistrationFormBase';
import RegistrationFormShipping from './RegistrationFormShipping';
import RegistrationFormActions from './RegistrationFormActions';
import { container } from './Registration.style';

/**
 * The Registration component.
 * @returns {JSX}
 */
const Registration = () => (
  <RegistrationProvider>
    <div className={container}>
      <RegistrationFormBase />
      <RegistrationFormShipping />
    </div>
    <RegistrationFormActions />
  </RegistrationProvider>
);

export default Registration;
