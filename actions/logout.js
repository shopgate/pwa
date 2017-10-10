/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import HttpRequest from '@shopgate/pwa-core/classes/HttpRequest';
import requestShopifyLogout from '../action-creators/requestShopifyLogout';
import errorShopifyLogout from '../action-creators/errorShopifyLogout';
import successShopifyLogout from '../action-creators/successShopifyLogout';
import { getShopifyUrl } from '../selectors';

/**
 * Log out the current user.
 * @return {Function} A redux thunk.
 */
export default () => (dispatch) => {
  const shopifyUrl = getShopifyUrl();

  dispatch(requestShopifyLogout());

  new HttpRequest(`${shopifyUrl}/account/logout`)
    .dispatch()
    .then((response) => {
      const {
        headers: { location } = {},
        statusCode,
      } = response;

      if (statusCode === 302 && location && location.endsWith(`${shopifyUrl}/`)) {
        dispatch(successShopifyLogout());
      } else {
        dispatch(errorShopifyLogout());
      }
    })
    .catch(() => {
      dispatch(errorShopifyLogout());
    });
};
