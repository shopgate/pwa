import { loadStripe } from '@stripe/stripe-js';

let resolve;
let reject;
let stripe;
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
      stripe = stripeObject;
      resolve(stripeObject);
      return stripeObject;
    } catch (err) {
      reject(err);
      throw err;
    }
  };
  return fn();
};

/**
 * Returns the sdk
 * @returns {Object}
 * */
export const getSdk = () => stripe;
