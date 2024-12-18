/* eslint-disable no-unused-expressions */
import React, { useCallback } from 'react';
import { isAvailable, InAppBrowser, Linking } from '@shopgate/native-modules';
import { useFormState } from '@shopgate/engage/core/hooks/useFormState';
import {
  i18n, useAsyncMemo, getUserAgent, LoadingProvider,
} from '@shopgate/engage/core';
import { MARKETING_OPT_IN_DEFAULT } from '@shopgate/engage/registration/constants';
import Context from './CheckoutProvider.context';
import connect from './CheckoutProvider.connector';
import { pickupConstraints, selfPickupConstraints } from './CheckoutProvider.constraints';
import { CHECKOUT_CONFIRMATION_PATTERN } from '../constants/routes';

type Props = {
  orderInitialized?: bool,
  orderReadOnly?: bool,
  pathPattern: string,
  children: any,
  shopSettings: any,
  paymentTransactions: any,
  billingAddress: any,
  shippingAddress: any,
  fulfillmentSlot: any,
  pickupAddress: any,
  taxLines: any,
  userLocation: any,
  isDataReady: bool,
  orderReserveOnly?: bool,
  isShippingAddressSelectionEnabled?: bool,
  isPickupContactSelectionEnabled?: bool,
  isGuestCheckout?: bool,
  campaignAttribution: any,
  order: any,
  fetchCart: () => Promise<any>,
  prepareCheckout: () => Promise<any>,
  fetchCheckoutOrder: () => Promise<any>,
  updateCheckoutOrder: () => Promise<any>,
  submitCheckoutOrder: () => Promise<any>,
  historyReplace: (any) => void,
  showModal: (any) => void,
  clearCheckoutCampaign: (any) => void,
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
  showModal,
  children,
  shopSettings,
  billingAddress,
  shippingAddress,
  pickupAddress,
  paymentTransactions,
  fetchCart,
  taxLines,
  userLocation,
  isDataReady,
  fulfillmentSlot,
  orderReserveOnly,
  isShippingAddressSelectionEnabled,
  isPickupContactSelectionEnabled,
  isGuestCheckout,
  campaignAttribution,
  clearCheckoutCampaign,
  order: checkoutOrder,
}: Props) => {
  const [paymentButton, setPaymentButton] = React.useState(null);
  const paymentHandlerRef = React.useRef(null);
  const [paymentData, setPaymentData] = React.useState(null);
  const [isLocked, setLocked] = React.useState(true);
  const [isButtonLocked, setButtonLocked] = React.useState(true);
  const [isLoading, setLoading] = React.useState(true);
  const [validationRules, setValidationRules] = React.useState(selfPickupConstraints);
  const [updateOptIns, setUpdateOptIns] = React.useState(false);

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
      const { needsPayment: needsPaymentCheckout, success } = await prepareCheckout({
        initializeOrder: !orderInitialized,
      });

      setLocked(false);

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

  // Handle passed errors from external checkout gateway.
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const errorCode = urlParams.get('errorCode');
    if (!errorCode) {
      return;
    }
    showModal({
      title: null,
      confirm: null,
      dismiss: 'modal.ok',
      message: 'checkout.errors.payment.genericExternal',
    });
  }, [showModal]);

  const submitPromise = React.useRef(null);

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
            ...(isShippingAddressSelectionEnabled ? {
              ...shippingAddress,
              customerContactId: shippingAddress.customerContactId || undefined,
            } : []),
            ...(isPickupContactSelectionEnabled ? {
              // When the customer is picking up himself we just take the
              // billing address as pickup address.
              ...(values.pickupPerson === 'me' ? {
                ...billingAddress,
                customerContactId: billingAddress.customerContactId || undefined,
                type: 'pickup',
              } : {
                type: 'pickup',
                firstName: values.firstName,
                lastName: values.lastName,
                mobile: values.mobile,
                emailAddress: values.emailAddress,
              }),
            } : []),
          ],
          primaryBillToAddressSequenceIndex: 0,
          primaryShipToAddressSequenceIndex: 1,
        });
      } catch (error) {
        setLocked(false);
        submitPromise?.current?.resolve?.();
        return;
      }
    } else if (isGuestCheckout && isPickupContactSelectionEnabled && values.instructions) {
      try {
        await updateCheckoutOrder({
          notes: values.instructions,
        });
      } catch (error) {
        setLocked(false);
        submitPromise?.current?.resolve?.();
        return;
      }
    }

    // Fulfill using selected payment method.
    let fulfilledPaymentTransactions = [];
    if (needsPayment) {
      fulfilledPaymentTransactions = await paymentHandlerRef.current.fulfillTransaction({
        paymentTransactions,
      });
      if (!fulfilledPaymentTransactions) {
        setLocked(false);
        submitPromise?.current?.resolve?.();
        return;
      }
    }

    // Submit fulfilled payment transaction to complete order.
    try {
      let marketingOptIn;

      if (updateOptIns) {
        ({ marketingOptIn } = optInFormState.values);
      }

      const { paymentTransactionResults, redirectNeeded } = await submitCheckoutOrder({
        paymentTransactions: fulfilledPaymentTransactions,
        userAgent: getUserAgent(),
        platform: 'engage',
        marketingOptIn,
        ...(campaignAttribution ? { campaignAttribution } : {}),
      });

      // Check if api requested a external redirect.
      if (redirectNeeded && paymentTransactionResults.length) {
        const { redirectParams: { url } = {} } = paymentTransactionResults[0];
        if (isAvailable()) {
          // Open the link in the native webview.
          await InAppBrowser.openLink({
            url,
            options: {
              enableDefaultShare: false,
            },
          });
          // On Close we simply unlock the checkout
          setLocked(false);
          submitPromise?.current?.resolve?.();
          return;
        }

        // Implemented specifically for paypal:
        // https://developer.paypal.com/docs/checkout/integration-features/funding-failure/
        // In the website we don't want to redirect and instead use to paypal sdk to
        // control the "mini browser" / popup.
        let redirectWanted = true;
        if (paymentHandlerRef?.current?.getSupportsRedirect) {
          redirectWanted = paymentHandlerRef?.current?.getSupportsRedirect();
        }
        if (redirectWanted) {
          window.location.href = url;
        } else {
          setLocked(false);
        }

        submitPromise?.current?.resolve?.(true);
        return;
      }
    } catch (error) {
      setLocked(false);
      submitPromise?.current?.resolve?.();
      return;
    }

    // Order is done, fetch again to retrieve infos for success page
    const [order] = await Promise.all([
      fetchCheckoutOrder(),
      fetchCart(),
    ]);

    clearCheckoutCampaign();

    historyReplace({
      pathname: CHECKOUT_CONFIRMATION_PATTERN,
      state: { order },
    });

    // We don't set locked to false to avoid unnecessary UI changes right before
    // going to confirmation page.
  }, [
    orderReadOnly,
    isGuestCheckout,
    isPickupContactSelectionEnabled,
    needsPayment,
    fetchCheckoutOrder,
    fetchCart,
    clearCheckoutCampaign,
    historyReplace,
    updateCheckoutOrder,
    billingAddress,
    isShippingAddressSelectionEnabled,
    shippingAddress,
    paymentTransactions,
    updateOptIns,
    submitCheckoutOrder,
    campaignAttribution,
    optInFormState.values,
  ]);

  const handleUpdateShippingMethod = useCallback(async (selectedShippingMethod) => {
    setLocked(true);

    try {
      await updateCheckoutOrder({
        addressSequences: [
          {
            ...billingAddress,
          },
          {
            ...shippingAddress,
            orderSegment: {
              selectedShippingMethod,
            },
          },
          ...(isGuestCheckout && pickupAddress ? [{
            ...pickupAddress,
          }] : []),
        ],
        primaryBillToAddressSequenceIndex: 0,
        primaryShipToAddressSequenceIndex: 1,
      });
    } catch (e) {
      // Nothing to see here
    }

    try {
      await fetchCheckoutOrder();
    } catch (e) {
      // Nothing to see here
    }

    setLocked(false);
  }, [
    billingAddress,
    pickupAddress,
    shippingAddress,
    fetchCheckoutOrder,
    isGuestCheckout,
    updateCheckoutOrder,
  ]);

  // Whenever the order is locked we also want to show to loading bar.
  React.useEffect(() => {
    if (isLocked) {
      setLoading(true);
      return;
    }
    setLoading(false);
  }, [isLocked]);

  React.useEffect(() => {
    if (isLoading) {
      LoadingProvider.setLoading(pathPattern);
      return;
    }
    LoadingProvider.resetLoading(pathPattern);
  }, [isLoading, pathPattern]);

  // Hold form states.
  const formState = useFormState(
    defaultPickupPersonState,
    handleSubmitOrder,
    validationRules
  );

  // When "someone-else" is picked for pickup the validation rules need to change.
  React.useEffect(() => {
    setValidationRules(
      formState.values.pickupPerson === 'me' || isGuestCheckout
        ? selfPickupConstraints
        : pickupConstraints
    );
  }, [formState.values.pickupPerson, isGuestCheckout]);

  const isOrderable = React.useMemo(
    () => (typeof checkoutOrder?.isOrderable !== 'undefined' ? checkoutOrder.isOrderable : true),
    [checkoutOrder]
  );

  // Create memoized context value.
  const value = React.useMemo(() => ({
    setPaymentHandler: (handler) => {
      setPaymentButton(() => handler.getCustomPayButton());
      paymentHandlerRef.current = handler;
    },
    paymentButton,
    paymentData,
    setPaymentData,
    paymentTransactions,
    isLocked,
    isButtonLocked: ((isLocked || isButtonLocked) && needsPayment) || !isOrderable,
    isLoading,
    supportedCountries: shopSettings.supportedCountries,
    countrySortOrder: shopSettings.countrySortOrder,
    formValidationErrors: convertValidationErrors(formState.validationErrors || {}),
    formSetValues: formState.setValues,
    handleSubmitOrder: (...params) => {
      const promise = new Promise((resolve, reject) => {
        submitPromise.current = {
          resolve,
          reject,
        };
      });
      formState.handleSubmit(...params);
      return promise;
    },
    handleValidation: () => formState.validate(formState.values),
    updateShippingMethod: handleUpdateShippingMethod,
    defaultPickupPersonState,
    userLocation,
    billingAddress,
    shippingAddress,
    pickupAddress,
    taxLines,
    order: checkoutOrder,
    currencyCode: checkoutOrder?.currencyCode,
    needsPayment,
    orderReserveOnly,
    isShippingAddressSelectionEnabled,
    isPickupContactSelectionEnabled,
    isGuestCheckout,
    fulfillmentSlot,
    optInFormSetValues: optInFormState.setValues,
    defaultOptInFormState,
    setUpdateOptIns: (val = true) => { setUpdateOptIns(val); },
    setButtonLocked,
    setLoading,
    setLocked,
  }), [
    paymentButton,
    paymentData,
    paymentTransactions,
    isLocked,
    isButtonLocked,
    needsPayment,
    isOrderable,
    isLoading,
    shopSettings.supportedCountries,
    shopSettings.countrySortOrder,
    formState,
    handleUpdateShippingMethod,
    userLocation,
    billingAddress,
    shippingAddress,
    pickupAddress,
    taxLines,
    checkoutOrder,
    orderReserveOnly,
    isShippingAddressSelectionEnabled,
    isPickupContactSelectionEnabled,
    isGuestCheckout,
    fulfillmentSlot,
    optInFormState.setValues,
    defaultOptInFormState,
  ]);

  // Handle deeplinks from external payment site.
  React.useEffect(() => {
    if (!isAvailable()) return undefined;

    /**
     * @param {Object} event Event
     */
    const listener = async (event) => {
      const { link = '' } = event?.detail || {};
      /* eslint-disable-next-line no-unused-vars */
      const [_, _scheme, path] = link.match(/(.*):\/\/([a-zA-Z0-9-/]*)(.*)/);

      // Order is done, fetch again to retrieve infos for success page
      if (path === 'payment/success') {
        const [order] = await Promise.all([
          fetchCheckoutOrder(),
          fetchCart(),
        ]);

        historyReplace({
          pathname: CHECKOUT_CONFIRMATION_PATTERN,
          state: { order },
        });
      } else if (path === 'payment/error') {
        showModal({
          title: null,
          confirm: null,
          dismiss: 'modal.ok',
          message: 'checkout.errors.payment.genericExternal',
        });
      }
    };

    Linking.addEventListener('deepLinkOpened', listener);
    return () => {
      Linking.removeEventListener('deepLinkOpened', listener);
    };
  }, [fetchCart, fetchCheckoutOrder, historyReplace, showModal]);

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
  isShippingAddressSelectionEnabled: false,
  isPickupContactSelectionEnabled: false,
  isGuestCheckout: false,
};

export default connect(CheckoutProvider);
/* eslint-enable no-unused-expressions */
