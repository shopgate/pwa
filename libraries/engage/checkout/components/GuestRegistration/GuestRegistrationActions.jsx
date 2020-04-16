import React from 'react';
import { css } from 'glamor';
import { i18n } from '@shopgate/engage/core';
import { RippleButton } from '@shopgate/engage/components';
import { useGuestRegistration } from '../../hooks/common';

const styles = {
  root: css({
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    flex: '0 0 auto',
  }).toString(),
};

/**
 * PickupContactForm
 * @returns {JSX}
 */
const Actions = () => {
  const {
    handleSubmit,
    isLocked,
  } = useGuestRegistration();

  return (
    <div className={styles.root}>
      <RippleButton
        type="secondary"
        onClick={handleSubmit}
        disabled={isLocked}
      >
        {i18n.text('checkout.continue_payment')}
      </RippleButton>
    </div>
  );
};

export default Actions;
