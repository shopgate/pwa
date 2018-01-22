/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import DataRequest from '@shopgate/pwa-core/classes/DataRequest';
import setDebugLoggingEnabled from '@shopgate/pwa-core/commands/setDebugLoggingEnabled';

/**
 * Enable debug logging.
 * @return {Function} A redux thunk.
 */
export const enableDebugLogging = () => () => {
  setDebugLoggingEnabled();
  (new DataRequest('ajax_started_live_logging')).dispatch();
};
