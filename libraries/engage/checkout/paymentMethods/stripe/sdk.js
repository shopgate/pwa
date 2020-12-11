import { loadStripe } from '@stripe/stripe-js';

let resolve;
let reject;
export const promise = new Promise((res, rej) => {
  resolve = res;
  reject = rej;
});

let loaded = false;

/**
 * Loads the stripe sdk
 * @param {string} publishableKey The publishable stripe key.
 * @returns {Stripe}
 */
export const loadSdk = (publishableKey) => {
  if (loaded) { return promise; }
  loaded = true;

  /** */
  const fn = async () => {
    try {
      const stripeObject = await loadStripe(publishableKey);
      resolve(stripeObject);
      return stripeObject;
    } catch (err) {
      reject(err);
      throw err;
    }
  };
  return fn();
};
