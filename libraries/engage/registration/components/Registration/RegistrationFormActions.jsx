import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { i18n, hasWebBridge } from '@shopgate/engage/core';
import { makeStyles } from '@shopgate/engage/styles';
import { Button } from '@shopgate/engage/components/v2';
import { useRegistration } from '../../hooks';

const useStyles = makeStyles()(theme => ({
  submitButtonContainer: {
    margin: theme.spacing(0, 2, 2),
    ...(hasWebBridge() ? {
      '@media(min-width: 768px)': {
        width: `calc(50% - ${theme.spacing(2)}px)`,
      },
    } : null),
  },
  submitButton: {
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
      <Button
        color="primary"
        fullWidth
        onClick={handleSubmit}
        disabled={isLocked}
        className={classes.submitButton}
      >
        {i18n.text(label)}
      </Button>
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
