import React from 'react';
import { css } from 'glamor';
import { i18n } from '@shopgate/engage/core';
import { Card } from '@shopgate/engage/components';
import { themeConfig } from '@shopgate/engage';
import { useCheckoutContext } from '../hooks/common';

const { colors, variables } = themeConfig;

const styles = {
  root: css({
    padding: variables.gap.big,
    paddingTop: 0,
    display: 'flex',
    flexDirection: 'column',
  }).toString(),
  h1: css({
    fontSize: 24,
    color: colors.dark,
    marginBottom: 4,
  }).toString(),
  card: css({
    display: 'flex',
    flexDirection: 'column',
    fontSize: 15,
    marginTop: variables.gap.small,
    padding: variables.gap.small,
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
        {i18n.text('checkout.billing.headline')}
      </span>
      <Card className={styles.card}>
        <span>Rene Eichhorn</span>
        <span>13373 Something</span>
        <span>Austin TX 78912</span>
      </Card>
    </div>
  );
};

export default Billing;
