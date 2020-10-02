import React from 'react';
import { css } from 'glamor';
import { i18n } from '@shopgate/engage/core';
import { RippleButton, SurroundPortals } from '@shopgate/engage/components';
import { useCheckoutContext } from '../../hooks/common';
import { SupplementalContent } from '../SupplementalContent';
import { CHECKOUT_ACTIONS } from '../../constants';

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
    isLocked,
  } = useCheckoutContext();

  return (
    <SurroundPortals portalName={CHECKOUT_ACTIONS}>
      <div className={styles.root}>
        <RippleButton
          type="secondary"
          onClick={handleSubmitOrder}
          disabled={isLocked}
        >
          {i18n.text('checkout.submit_order')}
        </RippleButton>
        <SupplementalContent />
      </div>
    </SurroundPortals>
  );
};

export default Actions;
