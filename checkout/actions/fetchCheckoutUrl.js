/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import logger from '@shopgate/pwa-core/helpers';
import requestUrl from '@shopgate/pwa-common/action-creators/url/requestUrl';
import receiveUrl from '@shopgate/pwa-common/action-creators/url/receiveUrl';
import errorUrl from '@shopgate/pwa-common/action-creators/url/errorUrl';
import { getEntryByType } from '@shopgate/pwa-common/selectors/url';
import { shouldFetchData } from '@shopgate/pwa-common/helpers/redux';
import { getCheckoutUrl } from '../selectors';

const URL_TYPE_CHECKOUT = 'checkout';

/**
 * Get the url for checkout.
 * @return {Function} A redux thunk.
 */
const fetchCheckoutUrl = () => (dispatch, getState) => {
  const state = getState();

  return new Promise((resolve, reject) => {
    if (shouldFetchData(getEntryByType(URL_TYPE_CHECKOUT, state), 'url')) {
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
    } else {
      // The checkoutUrl is still valid
      resolve(getCheckoutUrl(state));
    }
  });
};

export default fetchCheckoutUrl;
