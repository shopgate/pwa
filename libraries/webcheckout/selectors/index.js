import appConfig from '@shopgate/pwa-common/helpers/config';

/**
 * Checks if Shopify checkout is available.
 * @returns {boolean}
 */
export const hasShopifyCheckout = () => appConfig.webCheckoutShopify !== null;

/**
 * Returns the Shopify checkout configuration.
 * @returns {Object|null}
 */
export const getShopifyCheckout = () => appConfig.webCheckoutShopify;

/**
 * Returns the aliased Shopify URL.
 * @returns {string}
 */
export const getShopifyUrl = () => `https://${getShopifyCheckout().alias}.myshopify.com`;

/**
 * Checks if a configuration for Shopify is available
 * @return {boolean}
 */
export const isShopify = () => {
  const { alias } = getShopifyCheckout() || {};
  return !!alias;
};

/**
 * Returns the logout url for the logout action
 * @return {string}
 */
export const getLogoutUrl = () => {
  let result;

  if (isShopify()) {
    result = `${getShopifyUrl()}/account/logout`;
  } else {
    result = getShopifyCheckout().logoutUrl;
  }

  return result;
};

/**
 * Returns the logout success url for the logout action. It's used to determine, if the logout
 * process worked as expected.
 * @return {string}
 */
export const getLogoutSuccessUrl = () => {
  let result;

  if (isShopify()) {
    result = `${getShopifyUrl()}/`;
  } else {
    result = getShopifyCheckout().logoutSuccessUrl;
  }

  return result;
};
