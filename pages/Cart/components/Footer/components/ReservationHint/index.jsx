import React from 'react';
import { AppContext } from '@shopgate/engage/core';
import { I18n } from '@shopgate/engage/components';
import styles from './style';

/**
 * The CouponsHint components
 * @returns {JSX}
 */
const ReservationHint = () => (
  <AppContext.Consumer>
    {({ appConfig: { shopName } }) => (
      <I18n.Text
        className={styles}
        string="cart.reservation_hint"
        params={{ shopName }}
      />
    )}
  </AppContext.Consumer>
);

export default ReservationHint;
