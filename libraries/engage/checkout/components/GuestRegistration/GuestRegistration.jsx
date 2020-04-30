import React from 'react';
import { css } from 'glamor';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import PickupForm from './GuestRegistrationPickupForm';
import BillingForm from './GuestRegistrationBillingForm';
import Actions from './GuestRegistrationActions';
import Header from '../Checkout/CheckoutHeader';
import GuestRegistrationProvider from '../../providers/GuestRegistrationProvider';

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
 * The GuestRegistration component.
 * @returns {JSX}
 */
const GuestRegistration = () => (
  <GuestRegistrationProvider>
    <div className={styles.root}>
      <div className={styles.main}>
        <Header stepFrom={1} stepTo={2} />
        <BillingForm />
        <PickupForm />
        <Actions />
      </div>
      <div className={styles.main} />
    </div>
  </GuestRegistrationProvider>
);

export default GuestRegistration;
