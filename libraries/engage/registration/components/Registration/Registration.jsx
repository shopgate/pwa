import React, { useRef } from 'react';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  USER_REGISTER, USER_REGISTER_AFTER,
} from '@shopgate/pwa-common/constants/Portals';
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
    <Portal
      name={USER_REGISTER}
      formContainerRef={formContainerRef}
      parentStyleClass={container}
      childStyleClass={containerItem}
    >
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
        <Portal name={USER_REGISTER_AFTER}>
          <RegistrationFormActions />
        </Portal>
      </RegistrationProvider>
    </Portal>
  );
};

export default Registration;
