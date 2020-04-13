import React from 'react';
import { useFormState } from '@shopgate/engage/core/hooks/useFormState';
import {
  i18n, useAsyncMemo, getUserAgent, LoadingProvider,
} from '@shopgate/engage/core';
import Context from './CheckoutProvider.context';
import connect from './CheckoutProvider.connector';
import { pickupConstraints, selfPickupConstraints } from './CheckoutProvider.constraints';
import { useStripeContext } from '../hooks/common';
import { CHECKOUT_PATTERN, CHECKOUT_CONFIRMATION_PATTERN } from '../constants/routes';

type Props = {
  orderInitialized?: bool,
  orderReadOnly?: bool,
  children: any,
  shopSettings: any,
  paymentTransactions: any,
  billingAddress: any,
  pickupAddress: any,
  taxLines: any,
  userLocation: any,
  isDataReady: bool,
  fetchCart: () => Promise<any>,
  initializeCheckout: () => Promise<any>,
  fetchCheckoutOrder: () => Promise<any>,
  fetchPaymentMethods: () => Promise<any>,
  updateCheckoutOrder: () => Promise<any>,
  submitCheckoutOrder: () => Promise<any>,
  historyReplace: (any) => void,
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
  orderInitialized,
  orderReadOnly,
  historyReplace,
  initializeCheckout,
  fetchCheckoutOrder,
  fetchPaymentMethods,
  updateCheckoutOrder,
  submitCheckoutOrder,
  children,
  shopSettings,
  billingAddress,
  pickupAddress,
  paymentTransactions,
  fetchCart,
  taxLines,
  userLocation,
  isDataReady,
}: Props) => {
  const [isLocked, setLocked] = React.useState(false);
  const [validationRules, setValidationRules] = React.useState(selfPickupConstraints);

  // Get payment method api
  const activePaymentMethod = useStripeContext();

  // Initialize checkout process.
  const [isCheckoutInitialized] = useAsyncMemo(async () => {
    if (!orderInitialized) {
      await initializeCheckout();
    }

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
      if (!orderReadOnly) {
        await updateCheckoutOrder({
          notes: values.instructions,
          addressSequences: [
            billingAddress,
            // When the customer is picking up himself we just take the
            // billing address as pickup address.
            values.pickupPerson === 'me' ? {
              ...billingAddress,
              type: 'pickup',
            } : {
              type: 'pickup',
              firstName: values.firstName,
              lastName: values.lastName,
              mobile: values.cellPhone,
              emailAddress: values.emailAddress,
            },
          ],
          primaryBillToAddressSequenceIndex: 0,
          primaryShipToAddressSequenceIndex: 1,
        });
      }

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

      // Order is done, fetch again to retrieve infos for success page
      await Promise.all([
        fetchCheckoutOrder(),
        fetchCart(),
      ]);
      historyReplace({ pathname: CHECKOUT_CONFIRMATION_PATTERN });

      // We don't set locked to false to avoid unnecessary UI changes right before
      // going to confirmation page.
    };
    fn();
  }, [
    historyReplace,
    fetchCart,
    activePaymentMethod,
    billingAddress,
    orderReadOnly,
    paymentTransactions,
    submitCheckoutOrder,
    updateCheckoutOrder,
    fetchCheckoutOrder,
  ]);

  // Whenever the order is locked we also want to show to loading bar.
  React.useEffect(() => {
    if (isLocked) {
      LoadingProvider.setLoading(CHECKOUT_PATTERN);
      return;
    }
    LoadingProvider.unsetLoading(CHECKOUT_PATTERN);
  }, [isLocked]);

  // Hold form states.
  const formState = useFormState(
    defaultPickupPersonState,
    handleSubmitOrder,
    validationRules
  );

  // When "someone-else" is picked for pickup the validation rules need to change.
  React.useEffect(() => {
    setValidationRules(
      formState.values.pickupPerson === 'me'
        ? selfPickupConstraints
        : pickupConstraints
    );
  }, [formState.values.pickupPerson]);

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
    pickupAddress,
    taxLines,
  }), [
    isLocked,
    formState.setValues,
    formState.validationErrors,
    formState.handleSubmit,
    shopSettings.supportedCountries,
    userLocation,
    billingAddress,
    pickupAddress,
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

CheckoutProvider.defaultProps = {
  orderInitialized: false,
  orderReadOnly: false,
};

export default connect(CheckoutProvider);
