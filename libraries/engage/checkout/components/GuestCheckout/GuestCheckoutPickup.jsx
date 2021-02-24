import React, { useMemo } from 'react';
import { css } from 'glamor';
import { themeConfig } from '@shopgate/engage';
import { GUEST_CHECKOUT_PATTERN } from '../../constants/routes';
import Section from '../Checkout/CheckoutSection';
import { useCheckoutContext } from '../../hooks/common';
import { ADDRESS_TYPE_PICKUP } from '../../constants';

const { variables } = themeConfig;

const styles = {
  root: css({
    padding: `0 ${variables.gap.big}px ${variables.gap.big}px`,
    display: 'flex',
    flexDirection: 'column',
    flex: '0 0 auto',
  }).toString(),
  card: css({
    display: 'flex',
    flexDirection: 'column',
    fontSize: 15,
    margin: '8px 0 12px 0',
  }).toString(),
};

/**
 * GuestCheckoutPickup
 * @returns {JSX}
 */
const GuestCheckoutPickup = () => {
  const { pickupAddress, orderReserveOnly } = useCheckoutContext();
  const headline = useMemo(
    () =>
      (orderReserveOnly
        ? 'checkout.pickup_contact.headline_reserve'
        : 'checkout.pickup_contact.headline'),
    [orderReserveOnly]
  );

  if (!pickupAddress) {
    return null;
  }

  return (
    <div className={styles.root}>
      <Section
        className={styles.card}
        title={headline}
        editLink={`${GUEST_CHECKOUT_PATTERN}?edit=${ADDRESS_TYPE_PICKUP}`}
      >
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

export default GuestCheckoutPickup;
