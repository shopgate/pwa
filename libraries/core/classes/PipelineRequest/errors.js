/* eslint-disable require-jsdoc */

/**
 * TypeError.
 * @class
 */
export class TypeError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, TypeError);
  }
}

export const createTypeError = (expected, received) => (
  new TypeError(`Expected type ${expected}! Received type '${received}'`)
);

/* eslint-enable require-jsdoc */
