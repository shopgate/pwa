/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Returns client state (state.client)
 * @param {Object} state The application state.
 * @returns {Object}
 */
export const getClientInformation = state => state.client;

/**
 * Check if the platform is android.
 * @param {Object} state The application state.
 * @return {boolean}
 */
export const isAndroid = (state) => {
  const client = getClientInformation(state);

  return client.device.os.platform === 'android';
};
