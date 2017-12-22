/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import AppCommand from '../classes/AppCommand';

/**
 * Builds a cleanTab command.
 * @param {Object} params The command parameters.
 * @param {string} params.targetTab Target tab for the page.
 * @return {AppCommand}
 */
export const cleanTabCmd = params => (
  new AppCommand()
    .setCommandName('cleanTab')
    .setCommandParams(params)
);

/**
 * Sends a cleanTab command to the app.
 * @param {Object} params The command parameters.
 * @param {string} params.targetTab Target tab for the page.
 */
export default (params) => {
  cleanTabCmd(params)
    .dispatch();
};
