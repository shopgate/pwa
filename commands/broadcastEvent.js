/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import AppCommand from '../classes/AppCommand';

/**
 * Sends a broadcastEvent command to the app.
 * @param {string} event The event name.
 * @param {Array} [params=[]] Custom event parameters.
 */
export default (event, params = []) => {
  const command = new AppCommand();

  command
    .setCommandName('broadcastEvent')
    .dispatch(event, params);
};
