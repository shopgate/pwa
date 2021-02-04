import React from 'react';
import { css } from 'glamor';
import { useRoute } from '@shopgate/engage/core';
import { ResponsiveContainer } from '@shopgate/engage/components';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { CHECKOUT_PATTERN } from '../../constants/routes';
import ProfileProvider from '../../../account/components/Profile/Profile.provider';
import CheckoutProvider from '../../providers/CheckoutProvider';
import PaymentMethodProvider from '../../paymentMethods';
import { ADDRESS_TYPE_BILLING, ADDRESS_TYPE_SHIPPING } from '../../constants';
import PickupContactForm from './CheckoutPickupContactForm';
import Address from './CheckoutAddress';
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
    paddingTop: 16,
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
const Checkout = () => {
  const { id } = useRoute();

  return (
    <CheckoutProvider pathPattern={CHECKOUT_PATTERN} routeId={id}>
      <Header />
      <div className={styles.root}>
        <div className={styles.main}>
          <ProfileProvider isCheckout>
            <Address type={ADDRESS_TYPE_BILLING} />
            <Address type={ADDRESS_TYPE_SHIPPING} />
          </ProfileProvider>
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
};

export default Checkout;
