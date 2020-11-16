import {
  showModal, historyResetTo, historyPop, INDEX_PATH,
} from '@shopgate/engage/core';
import { CART_PATH } from '@shopgate/engage/cart';
import { MODAL_PIPELINE_ERROR } from '@shopgate/pwa-common/constants/ModalTypes';
import {
  getRouterStackIndex,
  makeGetPrevRouteIndexByPattern,
} from '@shopgate/pwa-common/selectors/router';
import * as Sentry from '@sentry/browser';

const getPrevRouteIndexByPatternCart = makeGetPrevRouteIndexByPattern(CART_PATH);

/**
 * Redirects the user to the cart
 * @param {Function} dispatch The Redux dispatch function
 * @param {Function} getState he Redux getState function
 */
const gotoCart = (dispatch, getState) => {
  const state = getState();
  const currentRouteIndex = getRouterStackIndex(state);
  const nextRouteIndex = getPrevRouteIndexByPatternCart(state);

  if (nextRouteIndex !== -1) {
    const steps = currentRouteIndex - nextRouteIndex;
    // Navigate back to a previous history entry if possible
    dispatch(historyPop({ steps }));
  } else {
    // Reset the history stack to the desired page when there is no old page within the stack
    dispatch(historyResetTo(CART_PATH));
  }
};

/**
 * Handles checkout errors.
 * @param {string} message Message shown to the user.
 * @param {string} pipeline Pipeline name.
 * @param {Object} error Error.
 * @param {boolean} redirect Whether it should redirect.
 * @param {Array} gotoCartErrorCodes A list of error codes which should redirect to the cart
 * @return {Object}
 */
export const errorCheckout = (
  message,
  pipeline,
  error,
  redirect,
  gotoCartErrorCodes = []
) => (dispatch, getState) => {
  let subCode;

  if (error?.errors) {
    const [first] = error.errors;
    ({ code: subCode } = first);
  }

  const errorObject = {
    code: error.code || 'NOT SET',
    message: JSON.stringify(error, null, 2),
  };

  // Go back to homepage and inform shopper.
  if (redirect) {
    dispatch(historyResetTo(INDEX_PATH));
  } else if (
    ['shopgate.checkout.initialize'].includes(pipeline) ||
    gotoCartErrorCodes.includes(subCode)
  ) {
    gotoCart(dispatch, getState);
  }

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
