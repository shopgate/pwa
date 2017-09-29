/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { OPEN_LINK } from '../../constants/ActionTypes';

/**
 * Creates the OPEN_LINK action object.
 * @param {Object} name The link action name.
 * @param {Object} params The link action parameters.
 * @returns {Object} A redux action.
 */
const openLink = (name, params) => ({
  type: OPEN_LINK,
  name,
  params,
});

export default openLink;
