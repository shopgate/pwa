import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useAsyncMemo } from '@shopgate/engage/core';

type Props = {
  publicKey?: string,
  children: any,
}

let stripeObject = null;

/**
 * A Provider that is needed for all stripe based
 * @param {Object} props The components props.
 * @returns {JSX}
 */
const StripeProvider = ({ publicKey = 'pk_test_Qlu5uyMuFNRyAH70DTpCBPlv', children }: Props) => {
  // Every stripe promise starts with a new Promise that is resolved later.
  const [stripePromise, resolve] = React.useMemo(() => {
    let resolver = null;
    const promise = new Promise((r) => { resolver = r; });
    return [promise, resolver];
  }, []);

  // Resolve promise by loading stripe sdk (once, or just resolve immediately)
  React.useEffect(() => {
    /** Async wrapper */
    const fn = async () => {
      if (!stripeObject) {
        stripeObject = await loadStripe(publicKey);
      }
      resolve(stripeObject);
    };
    fn();
  }, [publicKey, resolve]);

  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
};

export default StripeProvider;
