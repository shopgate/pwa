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
    margin: '8px 0 12px 0',
    padding: variables.gap.small,
  }).toString(),
};

/**
 * PickupContactForm
 * @returns {JSX}
 */
const Billing = () => {
  const { billingAddress } = useCheckoutContext();

  return (
    <div className={styles.root}>
      <span className={styles.h1}>
        {i18n.text('checkout.billing.headline')}
      </span>
      <Card className={styles.card}>
        <span>
          {billingAddress.middleName?.length
            ? `${billingAddress.firstName} ${billingAddress.middleName} ${billingAddress.lastName}`
            : `${billingAddress.firstName} ${billingAddress.lastName}`
          }
        </span>
        <span>{billingAddress.address1}</span>
        {billingAddress.address2?.length ? (
          <span>{billingAddress.address2}</span>
        ) : null}
        {billingAddress.address3?.length ? (
          <span>{billingAddress.address3}</span>
        ) : null}
        {billingAddress.address4?.length ? (
          <span>{billingAddress.address4}</span>
        ) : null}
        <span>{i18n.text('checkout.billing.address', billingAddress)}</span>
      </Card>
    </div>
  );
};

export default Billing;
