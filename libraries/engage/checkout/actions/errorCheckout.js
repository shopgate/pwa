import { showModal, historyResetTo, INDEX_PATH } from '@shopgate/engage/core';
import { MODAL_PIPELINE_ERROR } from '@shopgate/pwa-common/constants/ModalTypes';
import * as Sentry from '@sentry/browser';

/**
 * Handles checkout errors.
 * @param {string} message Message shown to the user.
 * @param {string} pipeline Pipeline name.
 * @param {Object} error Error.
 * @return {Object}
 */
export const errorCheckout = (message, pipeline, error) => (dispatch) => {
  const errorObject = {
    code: error.code || 'NOT SET',
    message: error.toString(),
  };

  // Go back to homepage and inform shopper.
  dispatch(historyResetTo(INDEX_PATH));
  dispatch(showModal({
    type: MODAL_PIPELINE_ERROR,
    title: null,
    confirm: null,
    dismiss: 'modal.ok',
    message,
    params: {
      pipeline,
      message: JSON.stringify(errorObject, null, 2),
    },
  }));

  // Log to sentry.
  Sentry.withScope((scope) => {
    scope.setLevel(Sentry.Severity.Critical);
    scope.setExtra('origin', 'checkout');
    Sentry.captureException(errorObject);
  });

  return {
    needsPayment: false,
    success: false,
  };
};
