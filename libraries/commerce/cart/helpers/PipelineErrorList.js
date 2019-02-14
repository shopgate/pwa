import { ECART } from '../constants/PipelineErrors';

/**
 * @typedef {Object} PipelineError
 * @property {string} code
 * @property {string} message
 * @property {PipelineErrorDetail[]} [errors]
 * @typedef {Object} PipelineErrorDetail
 * @property {string} entityId
 * @property {string} code
 * @property {string} message
 * @property {string[]} messageParams
 * @property {boolean} translated
 *
 * Creates a proper error object from pipeline error responses for easier error handling.
 * @param {PipelineError} error The error to be sanitize.
 * @return {PipelineErrorDetail[]}
 */
export default (error) => {
  const defaultError = {
    entityId: '',
    code: '',
    message: '',
    messageParams: [],
    translated: true,
  };

  // Not all error codes can contain an array of sub-errors with additional errors
  if (error.code !== ECART) {
    return [{
      ...defaultError,
      code: error.code,
      message: error.message,
    }];
  }

  // Ensure all properties actually exist
  const { errors = [] } = error;
  return errors.map(e => ({
    ...defaultError,
    ...e,
  }));
};
