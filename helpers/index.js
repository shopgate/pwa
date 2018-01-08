/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Converts arguments into a selenium readable format if test mode is set.
 * @param {Array} args Arguments that should be converted
 * @return {Array} converted arguments
 */
const convertLogArgs = (args) => {
  if (window.e2eTestLogs) {
    return [JSON.stringify(args)];
  }

  return args;
};

/**
 * The logging wrapper for the console.
 * @type {Object}
 */
export const logger = {
  ...console,
  debug: (...args) => console.debug(...convertLogArgs(args)),
  dir: (...args) => console.dir(...convertLogArgs(args)),
  dirxml: (...args) => console.dirxml(...convertLogArgs(args)),
  error: (...args) => console.error(...convertLogArgs(args)),
  info: (...args) => console.info(...convertLogArgs(args)),
  log: (...args) => console.log(...convertLogArgs(args)),
  warn: (...args) => console.warn(...convertLogArgs(args)),
};

/**
 * Returns a URL for performing XHR Requests.
 * @param {string} action The action to request on the server.
 * @return {string} The full URL.
 */
export const ajaxUrl = action => (action ? `sgapi:${action}` : '');

/**
 * Checks if the hasSGJavascriptBridge exists.
 * @return {boolean}
 */
export function hasSGJavaScriptBridge() {
  return (typeof SGJavascriptBridge !== 'undefined');
}
