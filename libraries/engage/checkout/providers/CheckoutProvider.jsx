import React from 'react';
import { useFormState } from '@shopgate/engage/core/hooks/useFormState';
import {
  i18n, useAsyncMemo, getUserAgent,
} from '@shopgate/engage/core';
import Context from './CheckoutProvider.context';
import connect from './CheckoutProvider.connector';
import { pickupConstraints } from './CheckoutProvider.constraints';
import { useStripeContext } from '../hooks/common';

type Props = {
  children: any,
  shopSettings: any,
  paymentTransactions: any,
  billingAddress: any,
  taxLines: any,
  userLocation: any,
  isDataReady: bool,
  initializeCheckout: () => Promise<any>,
  fetchCheckoutOrder: () => Promise<any>,
  fetchPaymentMethods: () => Promise<any>,
  updateCheckoutOrder: () => Promise<any>,
  submitCheckoutOrder: () => Promise<any>,
};

const defaultPickupPersonState = {
  pickupPerson: 'me',
  firstName: '',
  lastName: '',
  cellPhone: '',
  email: '',
  firstName2: '',
  lastName2: '',
  cellPhone2: '',
  email2: '',
};

/**
 * Converts validation errors into errors for form builder.
 * @param {Object} validationErrors The validation errors.
 * @returns {Array}
 */
const convertValidationErrors = validationErrors => Object
  .keys(validationErrors)
  .map(key => ({
    path: key,
    message: i18n.text(validationErrors[key]),
  }));

/**
 * Checkout Provider
 * @returns {JSX}
 */
const CheckoutProvider = ({
  initializeCheckout,
  fetchCheckoutOrder,
  fetchPaymentMethods,
  updateCheckoutOrder,
  submitCheckoutOrder,
  children,
  shopSettings,
  billingAddress,
  paymentTransactions,
  taxLines,
  userLocation,
  isDataReady,
}: Props) => {
  const [isLocked, setLocked] = React.useState(false);

  // Get payment method api
  const activePaymentMethod = useStripeContext();

  // Initialize checkout process.
  const [isCheckoutInitialized] = useAsyncMemo(async () => {
    await initializeCheckout();
    await updateCheckoutOrder({
      paymentTransactions: [{
        paymentMethod: {
          code: 'stripe',
        },
      }],
    });
    await Promise.all([
      fetchCheckoutOrder(),
      fetchPaymentMethods(),
    ]);
    return true;
  }, [], false);

  // Handles submit of the checkout form.
  const handleSubmitOrder = React.useCallback((values) => {
    /** Async wrapper for useCallback */
    const fn = async () => {
      setLocked(true);

      // Update order to set pickup contact.
      await updateCheckoutOrder({
        addressSequences: [
          billingAddress,
          {
            type: 'pickup',
            firstName: values.firstName,
            lastName: values.lastName,
            mobile: values.cellPhone,
            emailAddress: values.emailAddress,
            notes: values.instructions,
          },
        ],
        primaryBillToAddressSequenceIndex: 0,
        primaryShipToAddressSequenceIndex: 1,
      });

      // Fulfill using selected payment method.
      const fulfilledPaymentTransactions = await activePaymentMethod.fulfillTransaction({
        paymentTransactions,
      });
      if (!fulfilledPaymentTransactions) {
        setLocked(false);
        return;
      }

      // Submit fulfilled payment transaction to complete order.
      await submitCheckoutOrder({
        paymentTransactions: fulfilledPaymentTransactions,
        userAgent: getUserAgent(),
        platform: 'engage',
      });
      setLocked(false);
    };
    fn();
  }, [
    activePaymentMethod,
    billingAddress,
    paymentTransactions,
    submitCheckoutOrder,
    updateCheckoutOrder,
  ]);

  // Hold form states.
  const formState = useFormState(
    defaultPickupPersonState,
    handleSubmitOrder,
    pickupConstraints
  );

  // Create memoized context value.
  const value = React.useMemo(() => ({
    isLocked,
    supportedCountries: shopSettings.supportedCountries,
    formValidationErrors: convertValidationErrors(formState.validationErrors || {}),
    formSetValues: formState.setValues,
    handleSubmitOrder: formState.handleSubmit,
    defaultPickupPersonState,
    userLocation,
    billingAddress,
    taxLines,
  }), [
    isLocked,
    formState.setValues,
    formState.validationErrors,
    formState.handleSubmit,
    shopSettings.supportedCountries,
    userLocation,
    billingAddress,
    taxLines,
  ]);

  if (!isDataReady || !isCheckoutInitialized) {
    return null;
  }

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

export default connect(CheckoutProvider);
