/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import { shouldFetchData } from '../../helpers/redux';
import requestPageConfig from '../../action-creators/page/requestPageConfig';
import receivePageConfig from '../../action-creators/page/receivePageConfig';
import errorPageConfig from '../../action-creators/page/errorPageConfig';

/**
 * Retrieves the config for a page.
 * @param {string} pageId The ID of the page to request.
 * @return {Function} The dispatched action.
 */
const getPageConfig = pageId => (dispatch, getState) => {
  const state = getState();

  if (shouldFetchData(state.page[pageId])) {
    dispatch(requestPageConfig(pageId));

    return new PipelineRequest('getPageConfig')
      .setInput({ pageId })
      .dispatch()
      .then(result => dispatch(receivePageConfig(pageId, result)))
      .catch((error) => {
        logger.error(error);
        dispatch(errorPageConfig(pageId));
      });
  }

  return null;
};

export default getPageConfig;
