/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import AppCommand from '../classes/AppCommand';
import { hasSGJavaScriptBridge } from '../helpers';

/**
 * Sends an onload command if in the native app environment.
 */
export default () => {
  // This command is only needed inside an app environment.
  if (!hasSGJavaScriptBridge()) {
    return;
  }

  const command = new AppCommand();

  command
    .setCommandName('onload')
    .dispatch();
};
