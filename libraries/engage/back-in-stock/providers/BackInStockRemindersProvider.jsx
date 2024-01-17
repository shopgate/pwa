/* eslint-disable no-unused-expressions */
import React, { useCallback, useMemo } from 'react';
import { isAvailable, InAppBrowser, Linking } from '@shopgate/native-modules';
import { useFormState } from '@shopgate/engage/core/hooks/useFormState';
import {
  i18n, useAsyncMemo, getUserAgent, LoadingProvider,
} from '@shopgate/engage/core';
// import { MARKETING_OPT_IN_DEFAULT } from '@shopgate/engage/registration/constants';
import Context from './BackInSTockRemindersProvider.context';
import connect from './BackInStockRemindersProvider.connector';
// import { pickupConstraints, selfPickupConstraints } from './CheckoutProvider.constraints';
// import { CHECKOUT_CONFIRMATION_PATTERN } from '../constants/routes';

/**
 * Checkout Provider
 * @returns {JSX}
 */
const BackInStoreRemindersProvider = ({
  subscriptions,
  children,
}) => {
  console.log('sasa: BackInStoreRemindersProvider:21:subscriptions:', subscriptions);
  // Initialize checkout process.
  // const [{ isCheckoutInitialized, needsPayment }] = useAsyncMemo(async () => {
  //   try {
  //     const { needsPayment: needsPaymentCheckout, success } = await prepareCheckout({
  //       initializeOrder: !orderInitialized,
  //     });
  //
  //     setLocked(false);
  //
  //     return {
  //       isCheckoutInitialized: success,
  //       needsPayment: needsPaymentCheckout,
  //     };
  //   } catch (error) {
  //     return {
  //       isCheckoutInitialized: false,
  //       needsPayment: false,
  //     };
  //   }
  // }, [], false);

  // Handle passed errors from external checkout gateway.
  // React.useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const errorCode = urlParams.get('errorCode');
  //   if (!errorCode) {
  //     return;
  //   }
  //   showModal({
  //     title: null,
  //     confirm: null,
  //     dismiss: 'modal.ok',
  //     message: 'checkout.errors.payment.genericExternal',
  //   });
  // }, []);

  const submitPromise = React.useRef(null);

  // Handles submit of the checkout form.
  // const handleSubmitOrder = React.useCallback(async (values) => {
  //   setLocked(true);
  //
  //   // Update order to set pickup contact.
  //   if (!orderReadOnly) {
  //     try {
  //       await updateCheckoutOrder({
  //         notes: values.instructions,
  //         addressSequences: [
  //           {
  //             ...billingAddress,
  //             customerContactId: billingAddress.customerContactId || undefined,
  //           },
  //           ...(isShippingAddressSelectionEnabled ? {
  //             ...shippingAddress,
  //             customerContactId: shippingAddress.customerContactId || undefined,
  //           } : []),
  //           ...(isPickupContactSelectionEnabled ? {
  //             // When the customer is picking up himself we just take the
  //             // billing address as pickup address.
  //             ...(values.pickupPerson === 'me' ? {
  //               ...billingAddress,
  //               customerContactId: billingAddress.customerContactId || undefined,
  //               type: 'pickup',
  //             } : {
  //               type: 'pickup',
  //               firstName: values.firstName,
  //               lastName: values.lastName,
  //               mobile: values.mobile,
  //               emailAddress: values.emailAddress,
  //             }),
  //           } : []),
  //         ],
  //         primaryBillToAddressSequenceIndex: 0,
  //         primaryShipToAddressSequenceIndex: 1,
  //       });
  //     } catch (error) {
  //       setLocked(false);
  //       submitPromise?.current?.resolve?.();
  //       return;
  //     }
  //   } else if (isGuestCheckout && isPickupContactSelectionEnabled && values.instructions) {
  //     try {
  //       await updateCheckoutOrder({
  //         notes: values.instructions,
  //       });
  //     } catch (error) {
  //       setLocked(false);
  //       submitPromise?.current?.resolve?.();
  //       return;
  //     }
  //   }
  //
  //   // Fulfill using selected payment method.
  //   let fulfilledPaymentTransactions = [];
  //   if (needsPayment) {
  //     fulfilledPaymentTransactions = await paymentHandlerRef.current.fulfillTransaction({
  //       paymentTransactions,
  //     });
  //     if (!fulfilledPaymentTransactions) {
  //       setLocked(false);
  //       submitPromise?.current?.resolve?.();
  //       return;
  //     }
  //   }
  //
  //   // Submit fulfilled payment transaction to complete order.
  //   try {
  //     let marketingOptIn;
  //
  //     if (updateOptIns) {
  //       ({ marketingOptIn } = optInFormState.values);
  //     }
  //
  //     const { paymentTransactionResults, redirectNeeded } = await submitCheckoutOrder({
  //       paymentTransactions: fulfilledPaymentTransactions,
  //       userAgent: getUserAgent(),
  //       platform: 'engage',
  //       marketingOptIn,
  //       ...(campaignAttribution ? { campaignAttribution } : {}),
  //     });
  //
  //     // Check if api requested a external redirect.
  //     if (redirectNeeded && paymentTransactionResults.length) {
  //       const { redirectParams: { url } = {} } = paymentTransactionResults[0];
  //       if (isAvailable()) {
  //         // Open the link in the native webview.
  //         await InAppBrowser.openLink({
  //           url,
  //           options: {
  //             enableDefaultShare: false,
  //           },
  //         });
  //         // On Close we simply unlock the checkout
  //         setLocked(false);
  //         submitPromise?.current?.resolve?.();
  //         return;
  //       }
  //
  //       // Implemented specifically for paypal:
  //       // https://developer.paypal.com/docs/checkout/integration-features/funding-failure/
  //       // In the website we don't want to redirect and instead use to paypal sdk to
  //       // control the "mini browser" / popup.
  //       let redirectWanted = true;
  //       if (paymentHandlerRef?.current?.getSupportsRedirect) {
  //         redirectWanted = paymentHandlerRef?.current?.getSupportsRedirect();
  //       }
  //       if (redirectWanted) {
  //         window.location.href = url;
  //       } else {
  //         setLocked(false);
  //       }
  //
  //       submitPromise?.current?.resolve?.(true);
  //       return;
  //     }
  //   } catch (error) {
  //     setLocked(false);
  //     submitPromise?.current?.resolve?.();
  //     return;
  //   }
  //
  //   // Order is done, fetch again to retrieve infos for success page
  //   const [order] = await Promise.all([
  //     fetchCheckoutOrder(),
  //     fetchCart(),
  //   ]);
  //
  //   clearCheckoutCampaign();
  //
  //   historyReplace({
  //     pathname: CHECKOUT_CONFIRMATION_PATTERN,
  //     state: { order },
  //   });
  //
  //   // We don't set locked to false to avoid unnecessary UI changes right before
  //   // going to confirmation page.
  // }, [needsPayment, updateOptIns, optInFormState.values]);

  // Create memoized context value.
  const value = useMemo(() => ({

  }), []);

  // if (!isDataReady || !isCheckoutInitialized) {
  //   return null;
  // }

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

BackInStoreRemindersProvider.defaultProps = {
  // orderInitialized: false,
  // orderReadOnly: false,
  // orderReserveOnly: false,
  // isShippingAddressSelectionEnabled: false,
  // isPickupContactSelectionEnabled: false,
  // isGuestCheckout: false,
};

export default connect(BackInStoreRemindersProvider);
/* eslint-enable no-unused-expressions */
