import { ECART } from '../constants/PipelineErrors';

/**
 * @typedef {Object} PipelineError
 * @property {string} code
 * @property {string} message
 * @property {string} [pipeline]
 * @property {PipelineErrorElement[]} [errors]
 * @typedef {Object} PipelineErrorElement
 * @property {string} entityId
 * @property {string} code
 * @property {string} message
 * @property {Object} messageParams
 * @property {boolean} translated
 * @property {boolean} handled
 *
 * Creates a proper error object from pipeline error responses for easier error handling.
 * @param {string} pipelineName The name of the pipeline in which the error occurred.
 * @param {PipelineError} error The error to be sanitize.
 * @return {PipelineErrorElement[]}
 */
export default (pipelineName, error) => {
  const defaultPipelineError = {
    entityId: '',
    code: error.code || '',
    pipeline: pipelineName || '',
    message: error.message || '',
    messageParams: {},
    translated: true,
    handled: error.handled || false,
  };

  // Not all error codes can contain an array of sub-errors with additional errors
  if (error.code !== ECART) {
    return [defaultPipelineError];
  }

  // Ensure all properties actually exist
  const { errors = [] } = error;
  return errors.map(e => ({
    ...defaultPipelineError,
    ...e,
    code: `${error.code} :: ${e.code}`,
  }));
};
