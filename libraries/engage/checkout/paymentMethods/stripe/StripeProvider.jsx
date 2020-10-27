import React, { useEffect, useContext } from 'react';
import { i18n } from '@shopgate/engage/core';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements, CardNumberElement, useStripe, useElements,
} from '@stripe/react-stripe-js';
import Context from './StripeProvider.context';
import connect from './StripeProvider.connector';
import PaymentContext from '../context';

type PropsWrapper = {
  publishableKey?: string,
  children: any,
}

type Props = {
  children: any,
}

let stripeObject = null;

/**
 * A Provider that is needed for all stripe based
 * @param {Object} props The components props.
 * @returns {JSX}
 */
const StripeProvider = ({ children }: Props) => {
  const [error, setError] = React.useState(null);
  const stripe = useStripe();
  const elements = useElements();

  const contextApi = React.useMemo(() => ({
    error,
    setError,
    fulfillTransaction: async ({ paymentTransactions }) => {
      const activeTransaction = paymentTransactions[0];
      if (!activeTransaction?.checkoutParams?.paymentIntent) {
        setError(i18n.text('checkout.errors.noPaymentTransaction'));
        return false;
      }

      const {
        error: incomingError,
        paymentIntent,
      } = await stripe.confirmCardPayment(activeTransaction.checkoutParams.paymentIntent, {
        /* eslint-disable-next-line camelcase */
        payment_method: {
          card: elements.getElement(CardNumberElement),
        },
      });

      if (incomingError) {
        console.error(incomingError, activeTransaction.checkoutParams.paymentIntent);
        setError(incomingError.message);
        return false;
      }

      return [{
        id: activeTransaction.id,
        checkoutParams: {
          paymentIntentId: paymentIntent.id,
        },
      }];
    },
  }), [elements, error, stripe]);

  const { registerPaymentMethod } = useContext(PaymentContext);
  useEffect(() => {
    registerPaymentMethod(contextApi);
  }, [contextApi, registerPaymentMethod]);

  return (
    <Context.Provider value={contextApi}>
      {children}
    </Context.Provider>
  );
};

/**
 * A Provider that is needed for all stripe based
 * @param {Object} props The components props.
 * @returns {JSX}
 */
const StripeProviderWrapper = ({ publishableKey, children }: PropsWrapper) => {
  // Every stripe promise starts with a new Promise that is resolved later.
  const [stripePromise, resolve] = React.useMemo(() => {
    let resolver = null;
    const promise = new Promise((r) => { resolver = r; });
    return [promise, resolver];
  }, []);

  // Resolve promise by loading stripe sdk (once, or just resolve immediately)
  React.useEffect(() => {
    if (!publishableKey) {
      return;
    }

    /** Async wrapper */
    const fn = async () => {
      if (!stripeObject) {
        stripeObject = await loadStripe(publishableKey);
      }
      resolve(stripeObject);
    };
    fn();
  }, [publishableKey, resolve]);

  return (
    <Elements stripe={stripePromise}>
      <StripeProvider>
        {children}
      </StripeProvider>
    </Elements>
  );
};

StripeProviderWrapper.defaultProps = {
  publishableKey: null,
};

export default connect(StripeProviderWrapper);
