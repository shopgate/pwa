import { createSelector } from 'reselect';
import { ROPIS } from '../../locations';
import { getCheckoutOrder } from './order';

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

export const getPaymentMethodForStripe = makeGetPaymentMethodByProviderCode(() => 'stripe');

export const getStripePublishableKey = createSelector(
  getPaymentMethodForStripe,
  (paymentMethod) => {
    if (!paymentMethod) return null;
    return paymentMethod.settings?.publishableKey;
  }
);

export const getNeedsPaymentForOrder = createSelector(
  getCheckoutOrder,
  (order) => {
    if (!order) return null;

    const nonReserveItem = order.lineItems.find(
      lineItem => lineItem.fulfillmentMethod !== ROPIS
    );

    // Payment is only required if at least one non-reserve item is in order.
    return !!nonReserveItem;
  }
);
