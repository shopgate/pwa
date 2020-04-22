import React from 'react';
import { i18n } from '@shopgate/engage/core';
import { RippleButton } from '@shopgate/engage/components';
import { useRegistration } from '../../hooks';
import { submitButton, submitButtonContainer } from './Registration.style';

/**
 * PickupContactForm
 * @returns {JSX}
 */
const RegisterFormActions = () => {
  const {
    handleSubmit,
    isLocked,
  } = useRegistration();

  return (
    <div className={submitButtonContainer}>
      <RippleButton
        type="secondary"
        onClick={handleSubmit}
        disabled={isLocked}
        className={submitButton}
      >
        {i18n.text('registration.create_account')}
      </RippleButton>
    </div>
  );
};

export default RegisterFormActions;
