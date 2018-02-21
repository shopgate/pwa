/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import AppCommand from '../classes/AppCommand';

/**
 * Sends a setScrollingEnabled command to the app.
 * @param {Object} params The command parameters.
 * @param {boolean} params.enabled Target tab for the page.
 */
export default (params) => {
  new AppCommand()
    .setCommandName('setScrollingEnabled')
    .setCommandParams(params)
    .dispatch();
};
