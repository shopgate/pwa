import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

let stripeLibrary = null;
/**
 * Creates a stripe library singeleton once.
 * @param {string} publicKey The public key for stripe.
 * @returns {Promise}
 */
const tryLoadStripe = (publicKey = 'pk_test_Qlu5uyMuFNRyAH70DTpCBPlv') => {
  if (stripeLibrary) {
    return stripeLibrary;
  }
  stripeLibrary = loadStripe(publicKey);
  return stripeLibrary;
};

type Props = {
  publicKey: string,
  children: any,
}

/**
 * A Provider that is needed for all stripe based
 * @param {Object} props The components props.
 * @returns {JSX}
 */
const StripeProvider = ({ publicKey, children }: Props) => {
  const stripe = React.useMemo(tryLoadStripe, [publicKey]);

  return (
    <Elements stripe={stripe}>
      {children}
    </Elements>
  );
};

export default StripeProvider;
