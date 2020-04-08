import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import connect from './StripeProvider.connector';

type Props = {
  publishableKey: string,
  children: any,
}

let stripeObject = null;

/**
 * A Provider that is needed for all stripe based
 * @param {Object} props The components props.
 * @returns {JSX}
 */
const StripeProvider = ({ publishableKey, children }: Props) => {
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
      {children}
    </Elements>
  );
};

export default connect(StripeProvider);
