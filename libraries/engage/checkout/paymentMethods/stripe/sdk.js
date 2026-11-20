import { loadStripe } from '@stripe/stripe-js';
import { logger } from '@shopgate/engage/core/helpers';

/** @import { Stripe } from '@stripe/stripe-js' */

// Write a log when sdk module loads - should not happen before entering native checkout
logger.warn('Stripe SDK loaded');

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
 * @returns {Promise<Stripe|null>}
 */
export const loadSdk = (publishableKey) => {
  if (loaded || !publishableKey) { return promise; }
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
