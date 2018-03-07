/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import AppCommand from '../classes/AppCommand';

/**
 * Sends showNavigationBar command to the app.
 * @param {Object} [params=null] The command parameters.
 */
export default (params = null) => {
  const command = new AppCommand();

  command
    .setCommandName('showNavigationBar')
    .dispatch(params);
};
