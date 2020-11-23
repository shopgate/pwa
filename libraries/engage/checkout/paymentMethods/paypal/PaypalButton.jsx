import React from 'react';
import { isAvailable } from '@shopgate/native-modules';
import PaypalButtonWeb from './PaypalButtonWeb';
import PaypalButtonApp from './PaypalButtonApp';

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
    <PaypalButtonApp {...props} />
  );
};

export default PaypalButton;
