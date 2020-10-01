import React from 'react';
import { css } from 'glamor';
import { ResponsiveContainer } from '@shopgate/engage/components';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { CHECKOUT_PATTERN } from '../../constants/routes';
import CheckoutProvider from '../../providers/CheckoutProvider';
import PaymentMethodProvider from '../../paymentMethods';
import PickupContactForm from './CheckoutPickupContactForm';
import Billing from './CheckoutBilling';
import Summary from './CheckoutSummary';
import Actions from './CheckoutActions';
import Header from './CheckoutHeader';

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
const Checkout = () => (
  <CheckoutProvider pathPattern={CHECKOUT_PATTERN}>
    <Header />
    <div className={styles.root}>
      <div className={styles.main}>
        <Billing />
        <PickupContactForm />
        <PaymentMethodProvider />
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

export default Checkout;
