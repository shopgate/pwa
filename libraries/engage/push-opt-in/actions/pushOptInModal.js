import { grantPushPermissions } from '../../core';
import { hidePushOptInModal, optInPostponed } from '../action-creators';

/**
 * action to be dispatched when the user allowed the push opt-in in the modal
 * and native modal should be triggered for setting the permission
 * @returns {Function}
 */
export const allowPushOptInModal = () => async (dispatch) => {
  await dispatch(grantPushPermissions({ useSettingsModal: true }));
  dispatch(hidePushOptInModal());
};

/**
 * action to be dispatched when the user denied the push opt-in in the modal
 * @returns {Function}
 */
export const denyPushOptInModal = () => async (dispatch) => {
  await dispatch(optInPostponed());
  dispatch(hidePushOptInModal());
};

