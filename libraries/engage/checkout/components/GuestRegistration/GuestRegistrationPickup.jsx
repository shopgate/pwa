import React from 'react';
import { css } from 'glamor';
import { themeConfig } from '@shopgate/engage';
import Section from '../Checkout/CheckoutSection';
import { useCheckoutContext } from '../../hooks/common';

const { variables } = themeConfig;

const styles = {
  root: css({
    padding: variables.gap.big,
    paddingBottom: 0,
    display: 'flex',
    flexDirection: 'column',
    flex: '0 0 auto',
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
  const { pickupAddress } = useCheckoutContext();

  return (
    <div className={styles.root}>
      <Section className={styles.card} title="checkout.pickup_contact.headline">
        <span>
          {pickupAddress.middleName?.length
            ? `${pickupAddress.firstName} ${pickupAddress.middleName} ${pickupAddress.lastName}`
            : `${pickupAddress.firstName} ${pickupAddress.lastName}`
          }
        </span>
        <span>{pickupAddress.emailAddress}</span>
        <span>{pickupAddress.mobile}</span>
      </Section>
    </div>
  );
};

export default Billing;
