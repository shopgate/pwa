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
  const { taxLines } = useCheckoutContext();

  return (
    <div className={styles.root}>
      <span className={styles.h1}>
        {i18n.text('checkout.summary.headline')}
      </span>
      <div className={styles.card}>
        <div className={styles.columnLabel}>
          {taxLines.filter(t => t.visible).map((taxLine, i) => (
            <span
              key={taxLine.type}
              className={
                i === (taxLines.length - 1)
                  ? styles.lineBold
                  : styles.line
              }
            >
              {i18n.text(`checkout.summary.${taxLine.type}`)}
            </span>
          ))}
        </div>
        <div className={styles.columnPrice}>
          {taxLines.filter(t => t.visible).map((taxLine, i) => (
            <span
              key={taxLine.type}
              className={
                i === (taxLines.length - 1)
                  ? styles.priceLineBold
                  : styles.priceLine
              }
            >
              {i18n.price(taxLine.value, taxLine.currencyCode, true)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Billing;
