import React from 'react';
import { css } from 'glamor';
import { i18n } from '@shopgate/engage/core';
import { themeConfig } from '@shopgate/engage';
import { useCheckoutContext } from '../hooks/common';

const { colors } = themeConfig;

const styles = {
  root: css({
    padding: 16,
    paddingTop: 0,
    display: 'flex',
    flexDirection: 'column',
  }).toString(),
  h1: css({
    fontSize: 24,
    color: colors.dark,
    marginBottom: 4,
  }).toString(),
};

/**
 * PickupContactForm
 * @returns {JSX}
 */
const Billing = () => {
  useCheckoutContext();

  return (
    <div className={styles.root}>
      <span className={styles.h1}>
        {i18n.text('checkout.summary.headline')}
      </span>
    </div>
  );
};

export default Billing;
