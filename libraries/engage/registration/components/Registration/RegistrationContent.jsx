import React, { forwardRef } from 'react';
import { SHOP_SETTING_REGISTRATION_MODE_SIMPLE } from '@shopgate/engage/core';
import RegistrationFormBase from './RegistrationFormBase';
import RegistrationFormBilling from './RegistrationFormBilling';
import RegistrationFormShipping from './RegistrationFormShipping';
import RegistrationFormActions from './RegistrationFormActions';
import RegistrationFormExtra from './RegistrationFormExtra';
import RegistrationFormToggle from './RegistrationFormToggle';
import { container, containerItem } from './RegistrationContent.style';
import { useRegistration } from '../../hooks';

/**
 * The Registration component.
 * @returns {JSX}
 */
const Registration = forwardRef((_, ref) => {
  const {
    registrationMode,
  } = useRegistration();

  const renderSingleColumn = registrationMode === SHOP_SETTING_REGISTRATION_MODE_SIMPLE;

  return (
    <>
      <div className={container} ref={ref}>
        <div className={containerItem}>
          {!renderSingleColumn && (
            <RegistrationFormBase />
          )}
        </div>
        <div className={containerItem}>
          {renderSingleColumn && (
            <RegistrationFormBase />
          )}
          <RegistrationFormBilling />
          <RegistrationFormToggle />
          <RegistrationFormShipping />
          <RegistrationFormExtra />
        </div>
      </div>
      <RegistrationFormActions />
    </>
  );
});

export default Registration;
