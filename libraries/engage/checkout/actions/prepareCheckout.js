import { showModal, historyReset } from '@shopgate/engage/core';
import { getNeedsPaymentForOrder, getPaymentMethodForStripe } from '../selectors/payment';
import { initializeCheckout } from './initializeCheckout';
import { fetchCheckoutOrder } from './fetchCheckoutOrder';
import { updateCheckoutOrder } from './updateCheckoutOrder';
import { fetchPaymentMethods } from './fetchPaymentMethods';

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
    await dispatch(initializeCheckout());
  }

  await Promise.all([
    dispatch(fetchCheckoutOrder()),
    dispatch(fetchPaymentMethods()),
  ]);

  // If payment is needed we create a new payment transaction.
  const needsPayment = getNeedsPaymentForOrder(getState());
  if (needsPayment && initializePayment) {
    // Pick payment method.
    const stripe = getPaymentMethodForStripe(getState());
    if (!stripe) {
      dispatch(historyReset());
      dispatch(showModal({
        title: null,
        confirm: null,
        dismiss: 'modal.ok',
        message: 'checkout.errors.missingPaymentMethod',
      }));

      return {
        needsPayment: false,
        success: false,
      };
    }

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
  }

  return {
    needsPayment,
    success: true,
  };
};

