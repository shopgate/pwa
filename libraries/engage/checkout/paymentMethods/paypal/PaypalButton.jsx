import React from 'react';
import { css } from 'glamor';
import Button from '../../components/PaymentMethodButton';
import paypalLogoUrl from './paypal_logo.png';

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
const PaypalButton = props => (
  <Button {...props}>
    <img
      className={styles.logo}
      src={paypalLogoUrl}
      alt="PayPal"
    />
  </Button>
);

export default PaypalButton;
