/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import AppCommand from '../classes/AppCommand';

/**
 * Sends a setDebugLoggingEnabled command to the app.
 * @param {Object} params The command parameters.
 */
export default (params = {}) => {
  const command = new AppCommand();

  command
    .setCommandName('setDebugLoggingEnabled')
    .dispatch(params);
};
