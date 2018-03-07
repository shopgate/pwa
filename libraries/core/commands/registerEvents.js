/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import AppCommand from '../classes/AppCommand';

/**
 * Sends registerEvents command to the app.
 * This registers the WebView to certain app events.
 * @param {Array} events Events that should be registered.
 */
export default (events) => {
  const command = new AppCommand();

  command
    .setCommandName('registerEvents')
    .dispatch({ events });
};
