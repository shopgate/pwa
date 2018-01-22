/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import HttpRequest from '@shopgate/pwa-core/classes/HttpRequest';
import requestShopifyLogin from '../action-creators/requestShopifyLogin';
import errorShopifyLogin from '../action-creators/errorShopifyLogin';
import successShopifyLogin from '../action-creators/successShopifyLogin';
import { getShopifyUrl } from '../selectors';

/**
 * Login the current user.
 * @param {string} user The login user name.
 * @param {string} password The login password.
 * @return {Function} A redux thunk.
 */
export default (user, password) => (dispatch) => {
  dispatch(requestShopifyLogin());

  new HttpRequest(`${getShopifyUrl()}/account/login`)
    .setMethod('POST')
    .setTimeout(20000)
    .setPayload({
      form_type: 'customer_login',
      customer: {
        email: user,
        password,
      },
    })
    .dispatch()
    .then((response) => {
      const {
        headers: { location } = {},
        statusCode,
      } = response;

      if (statusCode === 302 && location && location.endsWith('/account')) {
        dispatch(successShopifyLogin());
      } else {
        dispatch(errorShopifyLogin());
      }
    })
    .catch(() => {
      dispatch(errorShopifyLogin());
    });
};
