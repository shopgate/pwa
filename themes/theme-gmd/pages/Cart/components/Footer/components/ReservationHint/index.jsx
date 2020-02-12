import React, { useContext } from 'react';
import { AppContext } from '@shopgate/engage/core';
import { I18n } from '@shopgate/engage/components';
import styles from './style';

/**
 * The CouponsHint components
 * @returns {JSX}
 */
const ReservationHint = () => {
  const { appConfig: { shopName } } = useContext(AppContext);

  return (
    <I18n.Text
      className={styles}
      string="cart.reservation_hint"
      params={{ shopName }}
    />
  );
};

export default ReservationHint;
