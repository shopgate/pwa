import { softOptInSelected } from '@shopgate/engage/core/action-creators';
import { grantPushPermissions } from '../../core';
import { hidePushOptInModal, optInPostponed } from '../action-creators';
import { getPushOptInTrackingMeta } from '../selectors';

/**
 * action to be dispatched when the user allowed the push opt-in in the modal
 * and native modal should be triggered for setting the permission
 * @returns {Function}
 */
export const allowPushOptIn = () => async (dispatch, getState) => {
  const meta = getPushOptInTrackingMeta(getState());

  dispatch(softOptInSelected({
    selected: 'approved',
    meta,
  }));

  await dispatch(grantPushPermissions({
    useSettingsModal: true,
    meta,
  }));

  dispatch(hidePushOptInModal());
};

/**
 * action to be dispatched when the user denied the push opt-in in the modal
 * @returns {Function}
 */
export const denyPushOptIn = () => async (dispatch, getState) => {
  const meta = getPushOptInTrackingMeta(getState());

  dispatch(softOptInSelected({
    selected: 'later',
    meta,
  }));

  await dispatch(optInPostponed());
  dispatch(hidePushOptInModal());
};

