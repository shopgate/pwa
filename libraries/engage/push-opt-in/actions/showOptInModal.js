import { PUSH_OPT_IN_MODAL } from '../constants';

/**
 * action to be dispatched when the push opt-in is supposed to be shown
 * @returns {Function}
 */
export const showOptInModal = () => ({
  type: PUSH_OPT_IN_MODAL,
});

