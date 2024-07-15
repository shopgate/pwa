import { HIDE_PUSH_OPT_IN_MODAL, SHOW_PUSH_OPT_IN_MODAL } from '../constants';

/**
 * action to be dispatched when the push opt-in should be shown
 * @returns {Function}
 */
export const showPushOptInModal = () => ({
  type: SHOW_PUSH_OPT_IN_MODAL,
});

/**
 * action to be dispatched when the push opt-in should be hidden
 * @returns {Function}
 */
export const hidePushOptInModal = () => ({
  type: HIDE_PUSH_OPT_IN_MODAL,
});
