import React from 'react';
import { css } from 'glamor';
import { isAvailable } from '@shopgate/native-modules';
import Button from '../../components/PaymentMethodButton';
import paypalLogoUrl from './paypal_logo.png';
import PaypalButtonWeb from './PaypalButtonWeb';

const styles = {
  logo: css({
    width: '60%',
  }).toString(),
};

/**
 * Paypal
 * @param {Object} props Props
 * @returns {JSX}
 */
const PaypalButton = (props) => {
  if (!isAvailable()) {
    return (
      <PaypalButtonWeb {...props} />
    );
  }

  return (
    <Button {...props}>
      <img
        className={styles.logo}
        src={paypalLogoUrl}
        alt="PayPal"
      />
    </Button>
  );
};

export default PaypalButton;
