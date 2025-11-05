/* eslint-disable no-unused-expressions */
import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { isAvailable, InAppBrowser, Linking } from '@shopgate/native-modules';
import { useFormState } from '@shopgate/engage/core/hooks/useFormState';
import {
  i18n, useAsyncMemo, getUserAgent, LoadingProvider,
} from '@shopgate/engage/core';
import { MARKETING_OPT_IN_DEFAULT } from '@shopgate/engage/registration/constants';
import PropTypes from 'prop-types';
import Context from './CheckoutProvider.context';
import connect from './CheckoutProvider.connector';
import { pickupConstraints, selfPickupConstraints } from './CheckoutProvider.constraints';
import { CHECKOUT_CONFIRMATION_PATTERN } from '../constants/routes';

/* eslint-disable max-len */
/**
 * Props for the CheckoutProvider component.
 * @typedef {Object} CheckoutProviderProps
 * @property {boolean} [orderInitialized=false] - Indicates if the order is initialized.
 * @property {boolean} [orderReadOnly=false] - Indicates if the order is read-only.
 * @property {string} pathPattern - The path pattern for the checkout.
 * @property {React.ReactNode} children - The child components.
 * @property {Object} shopSettings - The shop settings.
 * @property {Array} paymentTransactions - The payment transactions.
 * @property {Object} billingAddress - The billing address.
 * @property {Object} shippingAddress - The shipping address.
 * @property {Object} fulfillmentSlot - The fulfillment slot.
 * @property {Object} pickupAddress - The pickup address.
 * @property {Array} taxLines - The tax lines.
 * @property {Object} userLocation - The user location.
 * @property {boolean} isDataReady - Indicates if the data is ready.
 * @property {boolean} [orderReserveOnly=false] - Indicates if the order is reserve-only.
 * @property {boolean} [isShippingAddressSelectionEnabled=false] - Indicates if shipping address selection is enabled.
 * @property {boolean} [isPickupContactSelectionEnabled=false] - Indicates if pickup contact selection is enabled.
 * @property {boolean} [isGuestCheckout=false] - Indicates if guest checkout is enabled.
 * @property {Object} campaignAttribution - The campaign attribution data.
 * @property {Object} order - The checkout order.
 * @property {Function} fetchCart - Function to fetch the cart.
 * @property {Function} prepareCheckout - Function to prepare the checkout.
 * @property {Function} fetchCheckoutOrder - Function to fetch the checkout order.
 * @property {Function} updateCheckoutOrder - Function to update the checkout order.
 * @property {Function} submitCheckoutOrder - Function to submit the checkout order.
 * @property {Function} historyReplace - Function to replace the history.
 * @property {Function} showModal - Function to show a modal.
 * @property {Function} clearCheckoutCampaign - Function to clear the checkout campaign.
 */
/* eslint-enable max-len */

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
 * @param {CheckoutProviderProps} props The component props.
 * @returns {JSX.Element}
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
}) => {
  const [paymentButton, setPaymentButton] = useState(null);
  const paymentHandlerRef = useRef(null);
  const [paymentData, setPaymentData] = useState(null);
  const [isLocked, setLocked] = useState(true);
  const [isButtonLocked, setButtonLocked] = useState(true);
  const [isLoading, setLoading] = useState(true);
  const [validationRules, setValidationRules] = useState(selfPickupConstraints);
  const [updateOptIns, setUpdateOptIns] = useState(false);

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
  useEffect(() => {
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

  const submitPromise = useRef(null);

  // Handles submit of the checkout form.
  const handleSubmitOrder = useCallback(async (values) => {
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
  useEffect(() => {
    if (isLocked) {
      setLoading(true);
      return;
    }
    setLoading(false);
  }, [isLocked]);

  useEffect(() => {
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
  useEffect(() => {
    setValidationRules(
      formState.values.pickupPerson === 'me' || isGuestCheckout
        ? selfPickupConstraints
        : pickupConstraints
    );
  }, [formState.values.pickupPerson, isGuestCheckout]);

  const isOrderable = useMemo(
    () => (typeof checkoutOrder?.isOrderable !== 'undefined' ? checkoutOrder.isOrderable : true),
    [checkoutOrder]
  );

  // Create memoized context value.
  const value = useMemo(() => ({
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
  useEffect(() => {
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

CheckoutProvider.propTypes = {
  children: PropTypes.node.isRequired,
  clearCheckoutCampaign: PropTypes.func.isRequired,
  fetchCart: PropTypes.func.isRequired,
  fetchCheckoutOrder: PropTypes.func.isRequired,
  historyReplace: PropTypes.func.isRequired,
  isDataReady: PropTypes.bool.isRequired,
  pathPattern: PropTypes.string.isRequired,
  paymentTransactions: PropTypes.arrayOf(PropTypes.object).isRequired,
  prepareCheckout: PropTypes.func.isRequired,
  shopSettings: PropTypes.shape({
    supportedCountries: PropTypes.arrayOf(PropTypes.string),
    countrySortOrder: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  showModal: PropTypes.func.isRequired,
  submitCheckoutOrder: PropTypes.func.isRequired,
  taxLines: PropTypes.arrayOf(PropTypes.object).isRequired,
  updateCheckoutOrder: PropTypes.func.isRequired,
  userLocation: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  }).isRequired,
  billingAddress: PropTypes.shape({
    customerContactId: PropTypes.string,
  }),
  campaignAttribution: PropTypes.shape(),
  fulfillmentSlot: PropTypes.shape(),
  isGuestCheckout: PropTypes.bool,
  isPickupContactSelectionEnabled: PropTypes.bool,
  isShippingAddressSelectionEnabled: PropTypes.bool,
  order: PropTypes.shape({
    isOrderable: PropTypes.bool,
    currencyCode: PropTypes.string,
  }),
  orderInitialized: PropTypes.bool,
  orderReadOnly: PropTypes.bool,
  orderReserveOnly: PropTypes.bool,
  pickupAddress: PropTypes.shape({
    type: PropTypes.string,
  }),
  shippingAddress: PropTypes.shape({
    customerContactId: PropTypes.string,
  }),
};

CheckoutProvider.defaultProps = {
  billingAddress: null,
  campaignAttribution: null,
  fulfillmentSlot: null,
  isGuestCheckout: false,
  isPickupContactSelectionEnabled: false,
  isShippingAddressSelectionEnabled: false,
  order: null,
  orderInitialized: false,
  orderReadOnly: false,
  orderReserveOnly: false,
  pickupAddress: null,
  shippingAddress: null,
};

export default connect(CheckoutProvider);
/* eslint-enable no-unused-expressions */
