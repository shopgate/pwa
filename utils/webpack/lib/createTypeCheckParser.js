const ERROR_IN_FILE = /^(.+?)\((\d+),(\d+)\): error (TS\d+): (.*)$/;
const ERROR_WITHOUT_FILE = /^error (TS\d+): (.*)$/;
const CHECK_STARTED = /Starting (incremental )?compilation/;
const CHECK_FINISHED = /Found \d+ errors?\. Watching for file changes/;

/**
 * @typedef {Object} TypeCheckError
 * @property {string|null} file The file as the compiler printed it, relative to the project.
 * @property {number|null} line The line of the error.
 * @property {number|null} column The column of the error.
 * @property {string} code The error code, e.g. "TS2322".
 * @property {string} message The error message.
 */

/**
 * @typedef {Object} TypeCheckEvent
 * @property {'started'|'finished'} type Whether a check started or finished.
 * @property {TypeCheckError[]} [errors] The errors of a finished check.
 */

/**
 * Creates a parser for the output of "tsc --watch --pretty false". It takes the output line by
 * line and returns an event when a check starts or finishes.
 * @return {function(string): TypeCheckEvent|null}
 */
module.exports = function createTypeCheckParser() {
  let errors = [];

  return (line) => {
    if (CHECK_STARTED.test(line)) {
      errors = [];
      return { type: 'started' };
    }

    if (CHECK_FINISHED.test(line)) {
      return {
        type: 'finished',
        errors,
      };
    }

    const inFile = line.match(ERROR_IN_FILE);
    const withoutFile = line.match(ERROR_WITHOUT_FILE);

    if (inFile) {
      errors.push({
        file: inFile[1],
        line: Number(inFile[2]),
        column: Number(inFile[3]),
        code: inFile[4],
        message: inFile[5],
      });
    } else if (withoutFile) {
      errors.push({
        file: null,
        line: null,
        column: null,
        code: withoutFile[1],
        message: withoutFile[2],
      });
    } else if (/^\s+\S/.test(line) && errors.length > 0) {
      errors[errors.length - 1].message += `\n${line}`;
    }

    return null;
  };
};
