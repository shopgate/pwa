/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  getRelevantConfigs,
// eslint-disable-next-line import/no-unresolved
} from 'Library/helpers/tracking';
import Plugin from './Plugin';
import config from './config';

/**
 * Read the config and create plugin instances
 * @param {Object} clientInformation Information about the current client
 */
export default function init(clientInformation) {
  getRelevantConfigs(config, clientInformation).forEach(tracker => new Plugin(tracker.config));
}
