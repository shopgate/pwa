import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core';
import { RippleButton } from '@shopgate/engage/components';
import { useRegistration } from '../../hooks';
import { submitButton, submitButtonContainer } from './Registration.style';

/**
 * PickupContactForm
 * @param {Object} props The component props
 * @returns {JSX}
 */
const RegisterFormActions = ({ isGuest }) => {
  const {
    handleSubmit,
    isLocked,
    guestRegistrationEditMode,
    orderNeedsPayment,
  } = useRegistration(isGuest);

  const label = useMemo(() => {
    if (isGuest) {
      if (guestRegistrationEditMode) {
        return 'checkout.billing.save';
      }

      return orderNeedsPayment
        ? 'checkout.continue_payment'
        : 'checkout.continue';
    }

    return 'registration.create_account';
  }, [guestRegistrationEditMode, isGuest, orderNeedsPayment]);

  return (
    <div className={submitButtonContainer}>
      <RippleButton
        type="secondary"
        onClick={handleSubmit}
        disabled={isLocked}
        className={submitButton}
      >
        {i18n.text(label)}
      </RippleButton>
    </div>
  );
};

RegisterFormActions.propTypes = {
  isGuest: PropTypes.bool,
};

RegisterFormActions.defaultProps = {
  isGuest: false,
};

export default RegisterFormActions;
