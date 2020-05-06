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

  // If payment is needed we create a new payment transaction.
  const needsPayment = getNeedsPaymentForOrder(getState());
  if (needsPayment && initializePayment) {
    // Pick payment method.
    const stripe = getPaymentMethodForStripe(getState());
    if (!stripe) {
      return dispatch(errorCheckout(
        'checkout.errors.genericUpdate',
        'shopgate.checkout.getPaymentMethods',
        { message: 'No stripe payment methods found in configuration.' }
      ));
    }

    // Add payment transaction for stripe.
    try {
      await dispatch(updateCheckoutOrder({
        paymentTransactions: [{
          paymentMethod: {
            code: stripe.code,
          },
        }],
      }));
    } catch (error) {
      return dispatch(errorCheckout(
        'checkout.errors.genericUpdate',
        'shopgate.checkout.updateOrder',
        error
      ));
    }

    // Fetch updated order with new transaction config.
    await dispatch(fetchCheckoutOrder());
  }

  return {
    needsPayment,
    success: true,
  };
};

