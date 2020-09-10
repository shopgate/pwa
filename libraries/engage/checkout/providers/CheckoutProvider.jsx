import React from 'react';
import { useFormState } from '@shopgate/engage/core/hooks/useFormState';
import {
  i18n, useAsyncMemo, getUserAgent, LoadingProvider,
} from '@shopgate/engage/core';
import { MARKETING_OPT_IN_DEFAULT } from '@shopgate/engage/registration';
import Context from './CheckoutProvider.context';
import connect from './CheckoutProvider.connector';
import { pickupConstraints, selfPickupConstraints } from './CheckoutProvider.constraints';
import { useStripeContext } from '../hooks/common';
import { CHECKOUT_CONFIRMATION_PATTERN } from '../constants/routes';

type Props = {
  orderInitialized?: bool,
  orderReadOnly?: bool,
  pathPattern: string,
  children: any,
  shopSettings: any,
  paymentTransactions: any,
  billingAddress: any,
  fulfillmentSlot: any,
  pickupAddress: any,
  taxLines: any,
  userLocation: any,
  isDataReady: bool,
  orderReserveOnly?: bool,
  fetchCart: () => Promise<any>,
  prepareCheckout: () => Promise<any>,
  fetchCheckoutOrder: () => Promise<any>,
  updateCheckoutOrder: () => Promise<any>,
  submitCheckoutOrder: () => Promise<any>,
  historyReplace: (any) => void,
};

const defaultPickupPersonState = {
  pickupPerson: 'me',
  firstName: '',
  lastName: '',
  mobile: '',
  email: '',
  firstName2: '',
  lastName2: '',
  mobile2: '',
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

const initialOptInFormState = {
  marketingOptIn: MARKETING_OPT_IN_DEFAULT,
};

/**
 * Checkout Provider
 * @returns {JSX}
 */
const CheckoutProvider = ({
  pathPattern,
  orderInitialized,
  orderReadOnly,
  historyReplace,
  prepareCheckout,
  fetchCheckoutOrder,
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
  fulfillmentSlot,
  orderReserveOnly,
}: Props) => {
  const [isLocked, setLocked] = React.useState(true);
  const [validationRules, setValidationRules] = React.useState(selfPickupConstraints);
  const [updateOptIns, setUpdateOptIns] = React.useState(false);

  // Get payment method api
  const activePaymentMethod = useStripeContext();

  const defaultOptInFormState = {
    ...initialOptInFormState,
  };

  const optInFormState = useFormState(
    defaultOptInFormState,
    () => {}
  );

  // Initialize checkout process.
  const [{ isCheckoutInitialized, needsPayment }] = useAsyncMemo(async () => {
    try {
      LoadingProvider.setLoading(pathPattern);
      const { needsPayment: needsPaymentCheckout, success } = await prepareCheckout({
        initializeOrder: !orderInitialized,
      });

      setLocked(false);
      LoadingProvider.resetLoading(pathPattern);

      return {
        isCheckoutInitialized: success,
        needsPayment: needsPaymentCheckout,
      };
    } catch (error) {
      return {
        isCheckoutInitialized: false,
        needsPayment: false,
      };
    }
  }, [], false);

  // Handles submit of the checkout form.
  const handleSubmitOrder = React.useCallback(async (values) => {
    setLocked(true);

    // Update order to set pickup contact.
    if (!orderReadOnly) {
      try {
        await updateCheckoutOrder({
          notes: values.instructions,
          addressSequences: [
            {
              ...billingAddress,
              customerContactId: billingAddress.customerContactId || undefined,
            },
            // When the customer is picking up himself we just take the
            // billing address as pickup address.
            values.pickupPerson === 'me' ? {
              ...billingAddress,
              customerContactId: billingAddress.customerContactId || undefined,
              type: 'pickup',
            } : {
              type: 'pickup',
              firstName: values.firstName,
              lastName: values.lastName,
              mobile: values.mobile,
              emailAddress: values.emailAddress,
            },
          ],
          primaryBillToAddressSequenceIndex: 0,
          primaryShipToAddressSequenceIndex: 1,
        });
      } catch (error) {
        setLocked(false);
        return;
      }
    }

    // Fulfill using selected payment method.
    let fulfilledPaymentTransactions = [];
    if (needsPayment) {
      fulfilledPaymentTransactions = await activePaymentMethod.fulfillTransaction({
        paymentTransactions,
      });
      if (!fulfilledPaymentTransactions) {
        setLocked(false);
        return;
      }
    }

    // Submit fulfilled payment transaction to complete order.
    try {
      let marketingOptIn;

      if (updateOptIns) {
        ({ marketingOptIn } = optInFormState.values);
      }

      await submitCheckoutOrder({
        paymentTransactions: fulfilledPaymentTransactions,
        userAgent: getUserAgent(),
        platform: 'engage',
        marketingOptIn,
      });
    } catch (error) {
      setLocked(false);
      return;
    }

    // Order is done, fetch again to retrieve infos for success page
    const [order] = await Promise.all([
      fetchCheckoutOrder(),
      fetchCart(),
    ]);

    historyReplace({
      pathname: CHECKOUT_CONFIRMATION_PATTERN,
      state: { order },
    });

    // We don't set locked to false to avoid unnecessary UI changes right before
    // going to confirmation page.
  }, [
    optInFormState.values,
    orderReadOnly,
    needsPayment,
    fetchCheckoutOrder,
    fetchCart,
    historyReplace,
    updateCheckoutOrder,
    billingAddress,
    activePaymentMethod,
    paymentTransactions,
    updateOptIns,
    submitCheckoutOrder,
  ]);

  // Whenever the order is locked we also want to show to loading bar.
  React.useEffect(() => {
    if (isLocked) {
      LoadingProvider.setLoading(pathPattern);
      return;
    }
    LoadingProvider.resetLoading(pathPattern);
  }, [isLocked, pathPattern]);

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
    needsPayment,
    orderReserveOnly,
    fulfillmentSlot,
    optInFormSetValues: optInFormState.setValues,
    defaultOptInFormState,
    setUpdateOptIns: (val = true) => { setUpdateOptIns(val); },
  }), [
    isLocked,
    formState.setValues,
    formState.validationErrors,
    formState.handleSubmit,
    optInFormState.setValues,
    defaultOptInFormState,
    shopSettings.supportedCountries,
    userLocation,
    fulfillmentSlot,
    billingAddress,
    pickupAddress,
    taxLines,
    needsPayment,
    orderReserveOnly,
    setUpdateOptIns,
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
  orderReserveOnly: false,
};

export default connect(CheckoutProvider);
