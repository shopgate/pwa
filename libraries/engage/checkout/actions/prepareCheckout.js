import { getNeedsPaymentForOrder } from '../selectors/payment';
import { initializeCheckout } from './initializeCheckout';
import { fetchCheckoutOrder } from './fetchCheckoutOrder';
import { updateCheckoutOrder } from './updateCheckoutOrder';

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
    await dispatch(fetchCheckoutOrder());
  }

  // If payment is needed we create a new payment transaction.
  const needsPayment = getNeedsPaymentForOrder(getState());
  if (needsPayment && initializePayment) {
    await dispatch(updateCheckoutOrder({
      paymentTransactions: [{
        paymentMethod: {
          code: 'stripe',
        },
      }],
    }));
  }

  return {
    needsPayment,
  };
};

