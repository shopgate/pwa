/** @module checkout */
import { CHECKOUT_PATH } from '@shopgate/pwa-common/constants/RoutePaths';

// ACTIONS
export { default as fetchCheckoutUrl } from '@shopgate/pwa-common-commerce/checkout/actions/fetchCheckoutUrl';
export { fetchCheckoutOrder } from '@shopgate/engage/checkout/actions/fetchCheckoutOrder';
export { updateCheckoutOrder } from '@shopgate/engage/checkout/actions/updateCheckoutOrder';
export { submitCheckoutOrder } from '@shopgate/engage/checkout/actions/submitCheckoutOrder';
export { initializeCheckout } from '@shopgate/engage/checkout/actions/initializeCheckout';
export { fetchPaymentMethods } from '@shopgate/engage/checkout/actions/fetchPaymentMethods';

// CONSTANTS
export * from '@shopgate/pwa-common-commerce/checkout/constants/index';
export * from '@shopgate/pwa-common-commerce/checkout/constants/Pipelines';
export * from './constants';
export { CHECKOUT_PATH };

// SELECTORS
export * from '@shopgate/pwa-common-commerce/checkout/selectors';

// STREAMS
export * from '@shopgate/pwa-common-commerce/checkout/streams';

// Components
export { default as Checkout } from './components/Checkout';
export { default as CheckoutConfirmation } from './components/CheckoutConfirmation/CheckoutConfirmation';

