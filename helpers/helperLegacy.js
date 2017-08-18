/*
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

// eslint-disable-next-line import/no-unresolved
export { default as SGLink } from 'Library/1.0/common/shopgate-link.js';

/**
 * Sends a DataRequest
 * @param {string} url Url for the request
 */
export function sendDataRequest(url) {
  $.shopgate.ajax({ url: `sgapi:${url}` });
}

/**
 * Converts a hex encoded string to a bin encoded string
 * @param {string} string hex encoded string
 * @return {string} formatted string
 */
export function hex2bin(string) {
  return $.sgHelpers.hex2bin(string);
}

export const SGAction = window.SGAction;
