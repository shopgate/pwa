import * as Sentry from '@sentry/browser';
import { getNeedsPaymentForOrder, getPaymentMethodForStripe } from '../selectors/payment';
import { getCheckoutOrder } from '../selectors/order';
import { initializeCheckout } from './initializeCheckout';
import { fetchCheckoutOrder } from './fetchCheckoutOrder';
import { updateCheckoutOrder } from './updateCheckoutOrder';
import { fetchPaymentMethods } from './fetchPaymentMethods';
import { errorCheckout } from './errorCheckout';

/**
 * Starts entering the checkout process for the customer.
 * @returns {Function}
 */
export const prepareCheckout = ({
  initializeOrder = true,
  initializePayment = true,
}) => async (dispatch, getState) => {
  // Create order if needed.
  if (initializeOrder) {
    try {
      await dispatch(initializeCheckout());
    } catch (error) {
      return dispatch(errorCheckout(
        'checkout.errors.genericInitialize',
        'shopgate.checkout.initialize',
        error
      ));
    }
  }

  // Fetch fresh order and payment method configuration.
  await Promise.all([
    dispatch(fetchCheckoutOrder()),
    dispatch(fetchPaymentMethods()),
  ]);

  let stripe;

  // If payment is needed we create a new payment transaction.
  const needsPayment = getNeedsPaymentForOrder(getState());
  if (needsPayment) {
    // Pick payment method.
    stripe = getPaymentMethodForStripe(getState());
    if (!stripe) {
      return dispatch(errorCheckout(
        'checkout.errors.missingPaymentMethod',
        'shopgate.checkout.getPaymentMethods',
        { message: 'No stripe payment methods found in configuration.' }
      ));
    }
  }

  // Test if order is available in store.
  const order = getCheckoutOrder(getState());
  if (!order) {
    return dispatch(errorCheckout(
      'checkout.errors.genericInitialize',
      'shopgate.checkout.initialize',
      { message: 'No order received from API' }
    ));
  }

  // Put logging info to sentry.
  Sentry.configureScope((scope) => {
    scope.setTag('checkout_order_id', order.id);
    scope.addBreadcrumb({
      category: 'checkout',
      message: `Initialize checkout with order id ${order.id}`,
      level: 'info',
    });
  });

  if (needsPayment && initializePayment) {
    try {
      // Add payment transaction for stripe.
      await dispatch(updateCheckoutOrder({
        paymentTransactions: [{
          paymentMethod: {
            code: stripe.code,
          },
        }],
      }));

      // Fetch updated order with new transaction config.
      await dispatch(fetchCheckoutOrder());
    } catch (error) {
      return {
        success: false,
        needsPayment: false,
      };
    }
  }

  return {
    needsPayment,
    success: true,
  };
};

