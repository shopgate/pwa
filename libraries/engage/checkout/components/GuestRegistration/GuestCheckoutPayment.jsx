import React from 'react';
import { css } from 'glamor';
import { ResponsiveContainer } from '@shopgate/engage/components';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import Header from '../Checkout/CheckoutHeader';
import { GUEST_CHECKOUT_PAYMENT_PATTERN } from '../../constants/routes';
import CheckoutProvider from '../../providers/CheckoutProvider';
import PaymentProvider from '../../paymentMethods';
import Billing from '../Checkout/CheckoutAddress';
import Summary from '../Checkout/CheckoutSummary';
import Actions from '../Checkout/CheckoutActions';
import Pickup from './GuestRegistrationPickup';
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
const GuestCheckoutPayment = () => (
  <CheckoutProvider
    pathPattern={GUEST_CHECKOUT_PAYMENT_PATTERN}
    orderInitialized
    orderReadOnly
  >
    <Header stepFrom={2} stepTo={2} />
    <div className={styles.root}>
      <div className={styles.main}>
        <Pickup />
        <Billing guestCheckout />
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

export default GuestCheckoutPayment;

