import React from 'react';
import { i18n } from '@shopgate/engage/core/helpers';
import { SurroundPortals } from '@shopgate/engage/components';
import { Button } from '@shopgate/engage/components/v2';
import { makeStyles } from '@shopgate/engage/styles';
import { useCheckoutContext } from '../../hooks/common';
import { SupplementalContent } from '../SupplementalContent';
import { CHECKOUT_ACTIONS } from '../../constants';

const useStyles = makeStyles()({
  root: {
    padding: 16,
    paddingTop: 0,
    display: 'flex',
    flexDirection: 'column',
    flex: '0 0 auto',
  },
});

/**
 * PickupContactForm
 * @returns {JSX}
 */
const Actions = () => {
  const { classes } = useStyles();
  const {
    handleSubmitOrder,
    handleValidation,
    paymentButton: PaymentButton,
    isButtonLocked,
  } = useCheckoutContext();

  const originalButton = (
    <Button
      color="primary"
      onClick={handleSubmitOrder}
      disabled={isButtonLocked}
    >
      {i18n.text('checkout.submit_order')}
    </Button>
  );

  return (
    <SurroundPortals portalName={CHECKOUT_ACTIONS}>
      <div className={classes.root}>
        {PaymentButton ? (
          <PaymentButton
            onSubmit={handleSubmitOrder}
            onValidate={handleValidation}
            disabled={isButtonLocked}
          >
            {originalButton}
          </PaymentButton>
        ) : originalButton}
        <SupplementalContent />
      </div>
    </SurroundPortals>
  );
};

export default Actions;
