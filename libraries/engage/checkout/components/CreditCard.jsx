import React from 'react';
import { css } from 'glamor';
import { Card } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core';
import { themeConfig } from '@shopgate/engage';
import {
  CardElement,
} from '@stripe/react-stripe-js';
import { useCheckoutContext } from '../hooks/common';

const { colors, variables } = themeConfig;

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
  card: css({
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
        {i18n.text('checkout.creditCard.headline')}
      </span>
      <Card className={styles.card}>
        <CardElement />
      </Card>
    </div>
  );
};

export default Billing;
