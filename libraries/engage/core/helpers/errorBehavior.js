import { ToastProvider } from '@shopgate/pwa-common/providers';
import { MODAL_PIPELINE_ERROR } from '@shopgate/pwa-common/constants/ModalTypes';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import { logger, i18n } from '@shopgate/engage/core/helpers';

/**
 * Creates an error message for a pipeline and a code
 * @param {string} message The pipeline message
 * @param {Object} params Additional params for the message
 * @param {string} [pipeline=''] Name of the pipeline which caused the error
 * @returns {string}
 */
const getErrorMessage = (message, params = {}, pipeline = '') => {
  if (!/^((\w+)\.){1,}/gi.test(message)) {
    // Stop processing when the message is no i18n key
    return i18n.text(message, params);
  }

  const segments = message.split('.');
  const code = segments.pop();

  const pipelineKeys = [];
  const codeKeys = [];
  const genericKeys = [];
  let keys = [];

  // Generate a bunch of lookup keys from the message
  while (segments.length) {
    pipelineKeys.push([...segments, pipeline, code]);
    codeKeys.push([...segments, code]);
    genericKeys.push([...segments, 'generic']);
    segments.pop();
  }

  // Add common keys
  keys = [
    ...pipelineKeys,
    ...codeKeys,
    ...genericKeys,
    ...[`common.errors.${code}`, 'common.errors.generic'],
  ];

  const match = keys.find(key => i18n.getPath(key));

  try {
    return i18n.text(match, params);
  } catch (e) {
    return i18n.text(keys[keys.length - 1]);
  }
};

/**
 * Generates an error object for the error behaviors
 * @param {Object} originalError The original error object
 * @returns {Object}
 */
const getErrorObject = (originalError) => {
  const { code, context: pipeline = '', meta } = originalError;
  const {
    input: pipelineInput = {},
    message: originalMessage,
    additionalParams,
    translated,
  } = meta;

  const message = translated
    ? originalMessage
    : getErrorMessage(
      originalMessage,
      additionalParams,
      pipeline
    );

  const sanitized = {
    code: code ? code.toString() : code,
    pipeline,
    pipelineInput,
    originalMessage,
    message,
    additionalParams,
    translated,
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
    code, pipeline, message, pipelineInput, originalMessage, additionalParams, translated,
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
      translated,
      messageParams: additionalParams,
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
  getErrorMessage,
  toast,
  modal,
  custom,
  dispatchAction,
};
