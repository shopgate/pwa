/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import AppCommand from '../classes/AppCommand';

/**
 * Builds a performCommandsAfterDelay command.
 * @param {Object} params The command parameters.
 * @return {AppCommand}
 */
export const performCommandsAfterDelayCmd = params => (
  new AppCommand()
    .setCommandName('performCommandsAfterDelay')
    .setCommandParams(params)
);

/**
 * Sends a performCommandsAfterDelay command to the app.
 * @param {Object} params The command parameters.
 */
export default (params) => {
  performCommandsAfterDelayCmd(params)
    .dispatch();
};
