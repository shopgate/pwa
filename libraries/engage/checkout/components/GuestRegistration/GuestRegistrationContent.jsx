import React, { useMemo } from 'react';
import { css } from 'glamor';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { ResponsiveContainer } from '@shopgate/engage/components';
import PickupForm from './GuestRegistrationPickupForm';
import BillingForm from './GuestRegistrationBillingForm';
import Actions from './GuestRegistrationActions';
import Header from '../Checkout/CheckoutHeader';
import { useGuestRegistration } from '../../hooks/common';

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
 * The GuestRegistrationContent component.
 * @returns {JSX}
 */
const GuestRegistrationContent = () => {
  const { orderReserveOnly, isGuestCheckoutEditMode } = useGuestRegistration();
  const headline = useMemo(() => {
    if (isGuestCheckoutEditMode) {
      return orderReserveOnly ? 'checkout.change_contacts' : 'checkout.change_addresses';
    }

    return 'titles.checkout';
  }, [isGuestCheckoutEditMode, orderReserveOnly]);

  return (
    <div className={styles.root}>
      <div className={styles.main}>
        <Header
          stepFrom={!isGuestCheckoutEditMode ? 1 : null}
          stepTo={!isGuestCheckoutEditMode ? 2 : null}
          headline={headline}
        />
        <BillingForm />
        <PickupForm />
        <Actions />
      </div>
      <ResponsiveContainer breakpoint=">xs">
        <div className={styles.main} />
      </ResponsiveContainer>
    </div>
  );
};

export default GuestRegistrationContent;

