import { parseObjectToQueryString } from '../../helpers/router';
import { getRedirectLocation } from '../../selectors/history';
import ParsedLink from '../../components/Router/helpers/parsed-link';
import {
  CHECKOUT_PATH,
  INDEX_PATH,
} from '../../constants/RoutePaths';

/**
 * Append any necessary params and open the register URL.
 * @param {string} url The url to open.
 * @param {Object} state The current state.
 */
const openRegisterUrl = (url, state) => {
  // Get the current redirect location.
  const redirect = getRedirectLocation(state);

  // Split off any incoming params from the url.
  const urlParts = url.split('?');
  const originalUrlWithoutParams = urlParts[0] || url;
  const originalParams = urlParts[1] || null;

  // Determine a redirect url, null if missing or if it's the CHECKOUT_PATH.
  const redirectTo = (redirect && redirect.pathname !== CHECKOUT_PATH) ?
    `${redirect.pathname}${parseObjectToQueryString(redirect.params)}` : INDEX_PATH;

  // Build the callback data.
  const callbackData = JSON.stringify({
    redirectTo,
  });

  // Explicitly check if we are about to be redirected to the checkout.
  const redirectToCheckout = redirect && redirect.pathname === CHECKOUT_PATH;

  // Build up the params.
  const params = {
    sgcloud_callback_data: callbackData,
    ...redirectToCheckout && { sgcloud_checkout: 1 },
  };

  // Format the previous params.
  const prevParams = originalParams ? `&${originalParams}` : '';

  // Create formatted GET params.
  const query = `${parseObjectToQueryString(params, true)}${prevParams}`;

  // Build the new url with the GET params.
  const newUrl = `${originalUrlWithoutParams}${query}`;

  const link = new ParsedLink(newUrl);
  link.open();
};

export default openRegisterUrl;
