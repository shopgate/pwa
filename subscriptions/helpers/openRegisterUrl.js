/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { parseObjectToQueryString } from '../../helpers/router';
import { getRedirectLocation } from '../../selectors/history';
import ParsedLink from '../../components/Router/helpers/parsed-link';

/**
 * Append any necessary params and open the register URL.
 * @param {string} url The url to open.
 * @param {Object} state The current state.
 */
const openRegisterUrl = (url, state) => {
  // Get the current redirect location.
  const redirect = getRedirectLocation(state);

  // Determine a redirect url, null if missing.
  const redirectTo = redirect ?
    `${redirect.pathname}/${parseObjectToQueryString(redirect.params)}` : null;

  // Build the callback data.
  const callbackData = JSON.stringify({
    redirectTo,
  });

  // Explicitely check if we are about to be redirected to the checkout.
  const redirectoToCheckout = redirect && redirect.pathname === '/checkout';

  // Build up the params.
  const params = {
    sgcloud_callback_data: callbackData,
    ...redirectoToCheckout && { sgcloud_checkout: 1 },
  };

  // Create formatted GET params.
  const query = parseObjectToQueryString(params, true);

  // Build the new url with the GET params.
  const newUrl = `${url}/${query}`;

  const link = new ParsedLink(newUrl);
  link.open();
};

export default openRegisterUrl;
