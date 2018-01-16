/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import logger from '@shopgate/pwa-core/helpers';
import {
  requestUrl,
  receiveUrl,
  errorUrl,
} from '@shopgate/pwa-common/action-creators/url';

const URL_TYPE_CHECKOUT = 'checkout';

/**
 * Get the url for checkout.
 * @return {Function} A redux thunk.
 */
const fetchCheckoutUrl = () => dispatch =>
  new Promise((resolve, reject) => {
    dispatch(requestUrl(URL_TYPE_CHECKOUT));

    new PipelineRequest('getCheckoutUrl')
      .dispatch()
      .then(({ url, expires }) => {
        dispatch(receiveUrl(URL_TYPE_CHECKOUT, url, expires));
        resolve(url);
      })
      .catch((error) => {
        logger.error(error);
        dispatch(errorUrl(URL_TYPE_CHECKOUT));
        reject();
      });
  });

export default fetchCheckoutUrl;
