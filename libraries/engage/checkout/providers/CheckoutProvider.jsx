import React from 'react';
import { isAvailable, InAppBrowser, Linking } from '@shopgate/native-modules';
import { useFormState } from '@shopgate/engage/core/hooks/useFormState';
import {
  i18n, useAsyncMemo, getUserAgent, LoadingProvider,
} from '@shopgate/engage/core';
import { MARKETING_OPT_IN_DEFAULT } from '@shopgate/engage/registration';
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
  fulfillmentSlot: any,
  pickupAddress: any,
  taxLines: any,
  userLocation: any,
  isDataReady: bool,
  orderReserveOnly?: bool,
  campaignAttribution: any,
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
  pickupAddress,
  paymentTransactions,
  fetchCart,
  taxLines,
  userLocation,
  isDataReady,
  fulfillmentSlot,
  orderReserveOnly,
  campaignAttribution,
  clearCheckoutCampaign,
}: Props) => {
  const paymentHandlerRef = React.useRef(null);
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
      fulfilledPaymentTransactions = await paymentHandlerRef.current.fulfillTransaction({
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
          return;
        }
        window.location.href = url;
        return;
      }
    } catch (error) {
      setLocked(false);
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
    optInFormState.values,
    orderReadOnly,
    needsPayment,
    fetchCheckoutOrder,
    fetchCart,
    historyReplace,
    updateCheckoutOrder,
    billingAddress,
    paymentTransactions,
    updateOptIns,
    submitCheckoutOrder,
    paymentHandlerRef,
    campaignAttribution,
    clearCheckoutCampaign,
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
      formState.values.pickupPerson === 'me'
        ? selfPickupConstraints
        : pickupConstraints
    );
  }, [formState.values.pickupPerson]);

  // Create memoized context value.
  const value = React.useMemo(() => ({
    setPaymentHandler: (handler) => { paymentHandlerRef.current = handler; },
    isLocked,
    isButtonLocked: (isLocked || isButtonLocked) && needsPayment,
    isLoading,
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
    setButtonLocked,
    setLoading,
    setLocked,
  }), [
    isLocked,
    isButtonLocked,
    isLoading,
    shopSettings.supportedCountries,
    formState.validationErrors,
    formState.setValues,
    formState.handleSubmit,
    userLocation,
    billingAddress,
    pickupAddress,
    taxLines,
    needsPayment,
    orderReserveOnly,
    fulfillmentSlot,
    optInFormState.setValues,
    defaultOptInFormState,
    setLoading,
    setLocked,
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
};

export default connect(CheckoutProvider);
