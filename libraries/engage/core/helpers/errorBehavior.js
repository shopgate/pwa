import { ToastProvider } from '@shopgate/pwa-common/providers';
import { MODAL_PIPELINE_ERROR } from '@shopgate/pwa-common/constants/ModalTypes';
import showModal from '@shopgate/pwa-common//actions/modal/showModal';
import { logger, i18n } from '@shopgate/engage/core';

/**
 * Creates an error message for a pipeline and a code
 * @param {string} pipeline The pipeline name
 * @param {string} code The error code
 * @returns {string}
 */
const getErrorMessage = (pipeline, code) => {
  const checkKey = i18n.getPath;
  const message =
    checkKey(`pipelineErrors.${pipeline}.error.${code}`) ||
    checkKey(`pipelineErrors.${pipeline}.error.generic`) ||
    checkKey(`pipelineErrors.common.apiError.${code}`) ||
    checkKey('pipelineErrors.common.apiError.generic');

  return message;
};

/**
 * Generates an error object for the error behaviors
 * @param {Object} originalError The original error object
 * @returns {Object}
 */
const getErrorObject = (originalError) => {
  const { code, context: pipeline, meta } = originalError;
  const { input: pipelineInput, message: originalMessage } = meta;

  const sanitized = {
    code,
    pipeline,
    pipelineInput,
    originalMessage,
    message: getErrorMessage(pipeline.replace(/(.v[0-9]*)+$/, ''), code),
  };

  return sanitized;
};

/**
 * Enables a custom implementation for an error behavior. The passed callback will be invoked with
 * an object similar to streams (dispatch, getState, events). Additionally it contains the error
 * object and the error message.
 * @param {Function} callback A callback function for the custom error behavior
 * @returns {Function}
 */
const custom = callback => ({
  dispatch, getState, events, error,
}) => {
  if (typeof callback !== 'function') {
    logger.error('errorBehavior.custom: Please provide a callback function');
    return;
  }

  const sanitized = getErrorObject(error);

  callback({
    dispatch,
    getState,
    events,
    error: sanitized,
    message: sanitized.message,
  });
};

/**
 * Enables to dispatch a Redux action via a passed callback.
 * The callback is invoked with the error message.
 * @param {Function} callback A callback function for the custom error behavior
 * @returns {Function}
 */
const dispatchAction = callback => ({ dispatch, error }) => {
  const { message } = getErrorObject(error);
  dispatch(callback(message));
};

/**
 * Displays a pipeline error as a modal.
 * @returns {Function}
 */
const modal = () => ({
  dispatch, error,
}) => {
  const {
    code, pipeline, message, pipelineInput, originalMessage,
  } = getErrorObject(error);

  dispatch(showModal({
    confirm: 'modal.ok',
    dismiss: null,
    title: null,
    message,
    type: MODAL_PIPELINE_ERROR,
    params: {
      pipeline,
      request: pipelineInput,
      message: originalMessage,
      code,
    },
  }));
};

/**
 * Displays a pipeline error as a toast message.
 * @param {number} duration An optional display duration in ms for the toast
 * @returns {Function}
 */
const toast = duration => ({
  events, error,
}) => {
  const { message } = getErrorObject(error);

  events.emit(ToastProvider.ADD, {
    id: 'pipeline.error',
    message,
    duration,
  });
};

export default {
  toast,
  modal,
  custom,
  dispatchAction,
};
