/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import AppCommand from '../classes/AppCommand';

/**
 * Sends an analyticsSetCustomValues command to the app.
 * @param {Object} params The command parameters
 * @param {Array} [params.customDimensions] Array of customDimensions
 * @param {Array} [params.customMetrics] Array of customMetrics
 * @see https://wiki.shopgate.guru/display/SPEC/analyticsSetCustomValues
 */
export default (params) => {
  const command = new AppCommand();

  command
    .setCommandName('analyticsSetCustomValues')
    .dispatch(params);
};
