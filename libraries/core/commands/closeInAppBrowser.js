/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { cleanTabCmd } from './cleanTab';
import { popTabToRootCmd } from './popTabToRoot';
import showTab from './showTab';
import performCommandsAfterDelay from './performCommandsAfterDelay';

/**
 * Send all commands that are needed to close the inAppBrowser.
 * @param {boolean} isAndroid True if we are on a android device.
 */
export default (isAndroid) => {
  const targetTab = {
    targetTab: 'in_app_browser',
  };

  const delayedCommand = (isAndroid ? cleanTabCmd(targetTab) : popTabToRootCmd(targetTab)).command;

  performCommandsAfterDelay({
    cmds: [delayedCommand],
    delay: 0.4,
  });

  showTab({
    targetTab: 'main',
    transition: 'slideOutToBottom',
  });
};
