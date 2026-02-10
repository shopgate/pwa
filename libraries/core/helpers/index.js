import { emitter } from '../classes/ErrorManager';
import { SOURCE_CONSOLE } from '../constants/ErrorManager';

const csl = console;

/**
 * Converts logs into a readable format for Selenium, if testMode is enabled.
 * @param {Array} args Arguments that should be converted
 * @return {Array} converted arguments
 */
const convertLogArgs = (args) => {
  if (window.stringifyLogs) {
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
  debug: (...args) => csl.debug(...convertLogArgs(args)),
  dir: (...args) => csl.dir(...convertLogArgs(args)),
  dirxml: (...args) => csl.dirxml(...convertLogArgs(args)),
  error: (...args) => {
    emitter.emit(SOURCE_CONSOLE, args);
    csl.error(...convertLogArgs(args));
  },
  info: (...args) => csl.info(...convertLogArgs(args)),
  log: (...args) => csl.log(...convertLogArgs(args)),
  warn: (...args) => csl.warn(...convertLogArgs(args)),
  assert: (...args) => csl.assert(...convertLogArgs(args)),
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

/**
 * Checks whether the web bridge is active.
 * @returns {boolean}
 */
export function hasWebBridgeCore() {
  if (!hasSGJavaScriptBridge()) {
    return false;
  }
  return window.SGJavascriptBridge?.type === 'web' || window.SGJavascriptBridge?.type === 'desktop';
}

/**
 * Checks whether the browser connector should be used.
 * @return {boolean}
 */
export function useBrowserConnector() {
  if (hasSGJavaScriptBridge()) {
    return false;
  }

  if (process.env.NODE_ENV === 'development' && process.env.IP && process.env.PORT) {
    return false;
  }

  return true;
}

/**
 * Logs a deprecation warning.
 * @param {string} element The deprecated element.
 * @param {string} [version='v7.0.0'] The engage version of removal.
 */
export function logDeprecationMessage(element, version = 'v7.0.0') {
  logger.warn(`DEPRECATED: ${element} is deprecated. It will be removed in Engage ${version}`);
}

/**
 * Creates a hash from a string using a simple hash algorithm.
 * This replaces crypto-js MD5 for non-cryptographic hashing purposes (generating unique IDs).
 *
 * Note: This is NOT cryptographically secure, but suitable for generating unique identifiers.
 *
 * @param {string} input The string to hash.
 * @returns {string} The hex hash string (32 characters, similar to MD5).
 */
export const hashString = (input) => {
  if (!input || typeof input !== 'string') {
    return '0'.repeat(32);
  }

  // Simple hash function that produces a 32-character hex string
  let hash = 0;
  const { length } = input;

  for (let idx = 0; idx < length; idx += 1) {
    const char = input.charCodeAt(idx);
    // Equivalent to (hash << 5) - hash without bitwise operators
    hash = ((hash * 32) - hash) + char;
    // Ensure 32-bit integer by using modulo
    hash %= 2147483648;
  }

  // Convert to positive hex string and pad to 32 chars (MD5 length)
  const hex = Math.abs(hash).toString(16);
  return hex.padStart(32, '0');
};
