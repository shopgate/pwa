import { CHECKOUT_PATH } from '@shopgate/pwa-common/constants/RoutePaths';

export * from '@shopgate/pwa-common-commerce/checkout/constants/index';
export * from '@shopgate/pwa-common-commerce/checkout/constants/Pipelines';
export { CHECKOUT_PATH };

export {
  CHECKOUT_PATTERN,
  GUEST_CHECKOUT_PATTERN,
  CHECKOUT_CONFIRMATION_PATTERN,
  GUEST_CHECKOUT_PAYMENT_PATTERN,
  CHECKOUT_ADDRESS_BOOK_PATTERN,
  CHECKOUT_ADDRESS_BOOK_CONTACT_PATTERN,
  checkoutRoutes,
} from './routes';

export const CHECKOUT_ACTIONS = 'checkout.actions';
export const CHECKOUT_PICKUP_CONTACT_FORM = 'checkout.pickup-contact';
export const CHECKOUT_MARKETING_OPTIN = 'checkout.marketing-optin';

export const ADDRESS_TYPE_BILLING = 'billing';
export const ADDRESS_TYPE_SHIPPING = 'shipping';
export const ADDRESS_TYPE_PICKUP = 'pickup';

