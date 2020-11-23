import { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { isAvailable, PayPalRiskCheck } from '@shopgate/native-modules';
import PaymentContext from '../context';

/**
 * Paypal provider
 * @return {JSX}
 */
const PaypalProvider = ({ activePaymentMeta: activeFundingSource }) => {
  const { registerPaymentMethod } = useContext(PaymentContext);

  useEffect(() => {
    // Register payment method.
    registerPaymentMethod({
      // Paypal doesn't need to fulfill any transactions.
      fulfillTransaction: async ({ paymentTransactions }) => {
        if (isAvailable()) {
          const id = paymentTransactions?.[0]?.id;
          try {
            await PayPalRiskCheck.submit(id);
          } catch (e) {
            //
          }
        }

        return [];
      },
    });
  }, [activeFundingSource, registerPaymentMethod]);

  return null;
};

PaypalProvider.propTypes = {
  activePaymentMeta: PropTypes.string,
};

PaypalProvider.defaultProps = {
  activePaymentMeta: null,
};

export default PaypalProvider;
