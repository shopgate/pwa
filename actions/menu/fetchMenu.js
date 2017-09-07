/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import requestMenu from '../../action-creators/menu/requestMenu';
import receiveMenu from '../../action-creators/menu/receiveMenu';
import errorMenu from '../../action-creators/menu/errorMenu';

/**
 * Get the custom service menu entries.
 * @param {string} id The menu id.
 * @return {Function} A redux thunk.
 */
const fetchMenu = id => (dispatch) => {
  dispatch(requestMenu(id));

  new PipelineRequest('getMenu')
    .setInput({ id })
    .dispatch()
    .then((response) => {
      dispatch(receiveMenu(id, response.entries));
    })
    .catch((error) => {
      logger.error(error);
      dispatch(errorMenu(id));
    });
};

export default fetchMenu;
