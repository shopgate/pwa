export { default as SGLink } from '../shopgate-link';

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
