import React, { useMemo } from 'react';
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
    isGuestCheckoutEditMode,
  } = useGuestRegistration();

  const label = useMemo(() => {
    if (isGuestCheckoutEditMode) {
      return 'checkout.billing.save';
    }

    return needsPayment
      ? 'checkout.continue_payment'
      : 'checkout.continue';
  }, [isGuestCheckoutEditMode, needsPayment]);

  return (
    <div className={styles.root}>
      <RippleButton
        type="secondary"
        onClick={handleSubmit}
        disabled={isLocked}
      >
        { i18n.text(label) }
      </RippleButton>
    </div>
  );
};

export default Actions;
