import React from 'react';
import { css } from 'glamor';
import { ResponsiveContainer } from '@shopgate/engage/components';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import Header from '../Checkout/CheckoutHeader';
import { GUEST_CHECKOUT_PAYMENT_PATTERN } from '../../constants/routes';
import CheckoutProvider from '../../providers/CheckoutProvider';
import PaymentProvider from '../../paymentMethods';
import { ADDRESS_TYPE_BILLING, ADDRESS_TYPE_SHIPPING } from '../../constants';
import Address from '../Checkout/CheckoutAddress';
import Summary from '../Checkout/CheckoutSummary';
import Actions from '../Checkout/CheckoutActions';
import Pickup from './GuestCheckoutPickup';
import PickupNotes from './GuestCheckoutPickupNotes';
import GuestCheckoutOptIn from './GuestCheckoutOptIn';

const styles = {
  root: css({
    display: 'flex',
    flexDirection: 'row',
  }),
  main: css({
    flex: 1,
    [responsiveMediaQuery('>=md', { webOnly: true })]: {
      paddingRight: 16,
    },
  }),
  side: css({
    [responsiveMediaQuery('>=md', { webOnly: true })]: {
      marginTop: 16,
      flex: 0.6,
    },
  }),
};

/**
 * The Cart component.
 * @returns {JSX}
 */
const GuestCheckout = () => (
  <CheckoutProvider
    pathPattern={GUEST_CHECKOUT_PAYMENT_PATTERN}
    orderInitialized
    orderReadOnly
    isGuestCheckout
  >
    <Header stepFrom={2} stepTo={2} />
    <div className={styles.root}>
      <div className={styles.main}>
        <Pickup />
        <PickupNotes />
        <Address type={ADDRESS_TYPE_BILLING} />
        <Address type={ADDRESS_TYPE_SHIPPING} />
        <GuestCheckoutOptIn />
        <PaymentProvider />
        <ResponsiveContainer breakpoint="<md" appAlways>
          <Summary />
        </ResponsiveContainer>
        <Actions />
      </div>
      <div className={styles.side}>
        <ResponsiveContainer breakpoint=">=md" webOnly>
          <Summary />
        </ResponsiveContainer>
      </div>
    </div>
  </CheckoutProvider>
);

export default GuestCheckout;

