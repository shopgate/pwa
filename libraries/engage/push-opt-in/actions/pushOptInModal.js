import { PUSH_OPT_IN_MODAL } from '../constants';

/**
 * action to be dispatched when the push opt-in should be shown
 * @returns {Function}
 */
export const showPushOptInModal = () => ({
  type: PUSH_OPT_IN_MODAL,
});

/**
 * action to be dispatched when the push opt-in should be hidden
 * @returns {Function}
 */
export const hidePushOptInModal = () => ({
  type: PUSH_OPT_IN_MODAL,
});

