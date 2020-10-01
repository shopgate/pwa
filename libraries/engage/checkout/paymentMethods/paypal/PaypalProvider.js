import { useEffect, useContext } from 'react';
import PaymentContext from '../context';

/**
 * Paypal provider
 * @return {JSX}
 */
const PaypalProvider = () => {
  // Register payment method.
  const { registerPaymentMethod } = useContext(PaymentContext);
  useEffect(() => {
    registerPaymentMethod({
      // Paypal doesn't need to fulfill any transactions.
      fulfillTransaction: async () => ([]),
    });
  }, [registerPaymentMethod]);

  return null;
};

export default PaypalProvider;
