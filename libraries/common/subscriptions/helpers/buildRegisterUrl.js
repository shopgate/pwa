import queryString from 'query-string';
import {
  CHECKOUT_PATH,
  INDEX_PATH,
} from '../../constants/RoutePaths';

/**
 * Generates an url for registrations via the webcheckout. It injects additional parameters
 * for redirections after a successful registration or checkout.
 * @param {string} url The pure register url.
 * @param {string} [redirect=''] An url which is supposed to be opened after registration.
 * @return {string}
 */
const getRegisterUrl = (url, redirect = '') => {
  const parsed = queryString.parseUrl(url);

  // Generate the final redirect url. Checkout redirects are mapped to the start page.
  const redirectTo = (redirect && !redirect.startsWith(CHECKOUT_PATH)) ? redirect : INDEX_PATH;

  // Build the callback data.
  parsed.query.sgcloud_callback_data = JSON.stringify({ redirectTo });

  // Explicitly check if we are about to be redirected to the checkout.
  if (redirect && redirect.startsWith(CHECKOUT_PATH)) {
    parsed.query.sgcloud_checkout = 1;
  }

  // Recombine the url parts.
  return `${parsed.url}?${queryString.stringify(parsed.query)}`;
};

export default getRegisterUrl;
