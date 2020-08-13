/** @module checkout */
import { CHECKOUT_PATH } from '@shopgate/pwa-common/constants/RoutePaths';

// ACTIONS
export { default as fetchCheckoutUrl } from '@shopgate/pwa-common-commerce/checkout/actions/fetchCheckoutUrl';
export { fetchCheckoutOrder } from '@shopgate/engage/checkout/actions/fetchCheckoutOrder';
export { updateCheckoutOrder } from '@shopgate/engage/checkout/actions/updateCheckoutOrder';
export { submitCheckoutOrder } from '@shopgate/engage/checkout/actions/submitCheckoutOrder';
export { initializeCheckout } from '@shopgate/engage/checkout/actions/initializeCheckout';
export { fetchPaymentMethods } from '@shopgate/engage/checkout/actions/fetchPaymentMethods';
export { prepareCheckout } from '@shopgate/engage/checkout/actions/prepareCheckout';
export { updateDefaultBillingContact } from '@shopgate/engage/checkout/actions/updateDefaultBillingContact';

export { clearCheckoutOrder } from '@shopgate/engage/checkout/action-creators/clearCheckoutOrder';

// CONSTANTS
export * from '@shopgate/pwa-common-commerce/checkout/constants/index';
export * from '@shopgate/pwa-common-commerce/checkout/constants/Pipelines';
export * from './constants';
export { CHECKOUT_PATH };

// SELECTORS
export * from '@shopgate/pwa-common-commerce/checkout/selectors';
export * from './selectors/guestCheckout';
export * from './selectors/route';

// STREAMS
export * from '@shopgate/pwa-common-commerce/checkout/streams';

// Components
export { default as Checkout } from './components/Checkout/Checkout';
export { default as CheckoutBillingChange } from './components/CheckoutAddresses/CheckoutBillingChange';
export { default as GuestRegistration } from './components/GuestRegistration/GuestRegistration';
export { default as GuestCheckoutPayment } from './components/GuestRegistration/GuestCheckoutPayment';
export { default as CheckoutConfirmation } from './components/CheckoutConfirmation/CheckoutConfirmation';
