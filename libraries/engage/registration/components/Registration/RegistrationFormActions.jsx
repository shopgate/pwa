import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { i18n, isIOSTheme } from '@shopgate/engage/core';
import { makeStyles } from '@shopgate/engage/styles';
import { RippleButton } from '@shopgate/engage/components';
import { useRegistration } from '../../hooks';

const useStyles = makeStyles()(theme => ({
  submitButtonContainer: {
    margin: theme.spacing(0, 2, 2),
    ...(!isIOSTheme() ? {
      '@media(min-width: 768px)': {
        width: `calc(50% - ${theme.spacing(2)}px)`,
      },
    } : null),
  },
  submitButton: {
    width: '100%',
    marginTop: 8,
  },
}));

/**
 * PickupContactForm
 * @param {Object} props The component props
 * @returns {JSX}
 */
const RegisterFormActions = ({ isGuest }) => {
  const { classes } = useStyles();
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
    <div className={classes.submitButtonContainer}>
      <RippleButton
        type="secondary"
        onClick={handleSubmit}
        disabled={isLocked}
        className={classes.submitButton}
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
