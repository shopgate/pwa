import { createSelector } from 'reselect';
import { getIsReserveOnly } from './order';

/**
 * Returns all available payment methods.
 * @param {Object} state The application state.
 * @returns {Array}
 */
export const getPaymentMethods = state => state.checkout.paymentMethods.data;

/**
 * Creates a selector that will return the first payment method found that
 * implements the given by provider code.
 * @param {Object} getProviderCode Function to select provider code.
 * @returns {Object}
 */
export const makeGetPaymentMethodByProviderCode = getProviderCode => createSelector(
  getPaymentMethods,
  getProviderCode,
  (paymentMethods, providerCode) =>
    paymentMethods.find(methods => methods.paymentProvider?.code === providerCode)
);

/**
 * Selects the default payment method
 * @param {Object} state App state
 * @returns {Object}
 */
export const getDefaultPaymentMethod = state => getPaymentMethods(state)[0];

const getPaymentMethodForStripe = makeGetPaymentMethodByProviderCode(() => 'stripe');
export const getStripePublishableKey = createSelector(
  getPaymentMethodForStripe,
  (paymentMethod) => {
    if (!paymentMethod) return null;
    return paymentMethod.settings?.publishableKey;
  }
);

/**
 * @param {Object} state App state
 * @returns {boolean}
 */
export const getNeedsPaymentForOrder = state => !getIsReserveOnly(state);
