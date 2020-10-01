import React from 'react';
import { css } from 'glamor';
import { i18n } from '@shopgate/engage/core';
import { RippleButton } from '@shopgate/engage/components';
import { useCheckoutContext } from '../../hooks/common';
import { SupplementalContent } from '../SupplementalContent';

const styles = {
  root: css({
    padding: 16,
    paddingTop: 0,
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
    handleSubmitOrder,
    isButtonLocked,
  } = useCheckoutContext();

  return (
    <div className={styles.root}>
      <RippleButton
        type="secondary"
        onClick={handleSubmitOrder}
        disabled={isButtonLocked}
      >
        {i18n.text('checkout.submit_order')}
      </RippleButton>
      <SupplementalContent />
    </div>
  );
};

export default Actions;
