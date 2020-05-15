import React from 'react';
import { css } from 'glamor';
import { i18n } from '@shopgate/engage/core';
import { RippleButton } from '@shopgate/engage/components';
import { themeConfig } from '@shopgate/engage';
import { useGuestRegistration } from '../../hooks/common';

const { variables } = themeConfig;

const styles = {
  root: css({
    padding: `0 ${variables.gap.big}px ${variables.gap.big}px`,
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
    needsPayment,
  } = useGuestRegistration();

  return (
    <div className={styles.root}>
      <RippleButton
        type="secondary"
        onClick={handleSubmit}
        disabled={isLocked}
      >
        {needsPayment
          ? i18n.text('checkout.continue_payment')
          : i18n.text('checkout.continue')}
      </RippleButton>
    </div>
  );
};

export default Actions;
