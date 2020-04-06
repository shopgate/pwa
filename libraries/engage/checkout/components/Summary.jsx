import React from 'react';
import { css } from 'glamor';
import { i18n } from '@shopgate/engage/core';
import { themeConfig } from '@shopgate/engage';
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
    display: 'flex',
    flexDirection: 'row',
    fontSize: 15,
    marginTop: 2,
    marginBottom: variables.gap.small,
  }).toString(),
  columnLabel: css({
    flex: 2,
    display: 'flex',
    flexDirection: 'column',
  }).toString(),
  columnPrice: css({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  }).toString(),
  line: css({
    color: colors.shade11,
    fontSize: 15,
  }).toString(),
  lineBold: css({
    color: colors.shade11,
    fontWeight: '500',
    fontSize: 15,
  }).toString(),
  priceLine: css({
    color: colors.dark,
    fontWeight: '400',
    textAlign: 'right',
  }).toString(),
  priceLineBold: css({
    color: colors.dark,
    fontWeight: '500',
    textAlign: 'right',
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
      <div className={styles.card}>
        <div className={styles.columnLabel}>
          <span className={styles.line}>Line 1</span>
          <span className={styles.line}>Line 2</span>
          <span className={styles.lineBold}>Line 3</span>
        </div>
        <div className={styles.columnPrice}>
          <span className={styles.priceLine}>$123.12</span>
          <span className={styles.priceLine}>$123.12</span>
          <span className={styles.priceLineBold}>$123.12</span>
        </div>
      </div>
    </div>
  );
};

export default Billing;
