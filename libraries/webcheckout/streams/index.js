import { main$ } from '@shopgate/pwa-common/streams/main';
import {
  SUCCESS_SHOPIFY_LOGIN,
  ERROR_SHOPIFY_LOGIN,
  WEBCHECKOUT_REGISTER_REDIRECT,
} from '../constants';

/**
 * Gets triggered on successful Shopify login.
 * @type {Observable}
 */
export const shopifyDidLogin$ = main$
  .filter(({ action }) => action.type === SUCCESS_SHOPIFY_LOGIN);

/**
 * Gets triggered on failed Shopify login.
 * @type {Observable}
 */
export const shopifyLoginFailed$ = main$
  .filter(({ action }) => action.type === ERROR_SHOPIFY_LOGIN);

/**
 * Gets triggered on any Shopify login response (success or error).
 * @type {Observable}
 */
export const shopifyDidRespond$ = (
  shopifyDidLogin$.merge(shopifyLoginFailed$)
);

/**
 * Gets triggered before redirect to we registration
 * @type {Observable}
 */
export const webCheckoutRegisterRedirect$ = main$
  .filter(({ action }) => action.type === WEBCHECKOUT_REGISTER_REDIRECT);
