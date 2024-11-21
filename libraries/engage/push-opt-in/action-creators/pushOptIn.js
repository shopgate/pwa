import { HIDE_PUSH_OPT_IN_MODAL, SHOW_PUSH_OPT_IN_MODAL } from '../constants';

/**
 * action to be dispatched when the push opt-in should be shown
 * @param {"appStarts"|"ordersPlaced"} triggerType Trigger type that caused showing the modal
 * @returns {Function}
 */
export const showPushOptInModal = triggerType => ({
  type: SHOW_PUSH_OPT_IN_MODAL,
  triggerType,
});

/**
 * action to be dispatched when the push opt-in should be hidden
 * @returns {Function}
 */
export const hidePushOptInModal = () => ({
  type: HIDE_PUSH_OPT_IN_MODAL,
});
