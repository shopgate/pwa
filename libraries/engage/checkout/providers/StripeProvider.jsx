import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements, CardElement, useStripe, useElements,
} from '@stripe/react-stripe-js';
import Context from './StripeProvider.context';
import connect from './StripeProvider.connector';

type PropsWrapper = {
  publishableKey: string,
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
  const stripe = useStripe();
  const elements = useElements();

  const contextApi = React.useMemo(() => ({
    fulfillTransaction: async ({ paymentTransactions }) => {
      const activeTransaction = paymentTransactions[0];
      const {
        errors,
        paymentIntent,
      } = await stripe.confirmCardPayment(activeTransaction.checkoutParams.paymentIntent, {
        /* eslint-disable-next-line camelcase */
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (errors) {
        /* eslint-disable-next-line no-console */
        console.warn('Stripe error: ', errors);
        return false;
      }

      return [{
        id: activeTransaction.id,
        checkoutParams: {
          paymentIntentId: paymentIntent.id,
        },
      }];
    },
  }), [elements, stripe]);

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

export default connect(StripeProviderWrapper);
