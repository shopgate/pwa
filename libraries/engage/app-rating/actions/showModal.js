import showModalAction from '@shopgate/pwa-common/actions/modal/showModal';
import { getPlatform } from '@shopgate/pwa-common/selectors/client';
import { historyPush } from '@shopgate/pwa-common/actions/router';
import appConfig from '@shopgate/pwa-common/helpers/config';
import {
  increaseRejectionCount,
  setAlreadyRated,
  setLastPopupTimestamp,
} from '../action-creators/popup';
import { generateReviewLink } from '../helpers';
import { TIMER_TIMESPAN } from '../constants';
import { getAppRatingState } from '../selectors/appRating';

const {
  appRating: {
    bundleId: bId,
    rejectionLink,
    minDaysBetweenPopups,
    approveRejection,
  },
} = appConfig;

/**
 * to handle the modal confirmation
 * @return {(function(*, *): void)|*}
 */
function confirmModal() {
  return (dispatch, getState) => {
    const platform = getPlatform(getState());
    const link = generateReviewLink(bId[platform], platform);
    if (!link) {
      return;
    }

    dispatch(setAlreadyRated(true));
    dispatch(historyPush({
      pathname: link,
    }));
  };
}

/**
 * to handle the modal rejection
 * @return {(function(*): void)|*}
 */
function rejectModal() {
  return (dispatch) => {
    if (rejectionLink) {
      dispatch(historyPush({
        pathname: rejectionLink,
      }));
    }
  };
}

/**
 * shows the actual modal
 * @param {Function} resetAction the reset action function
 * @param {Function} increaseAction the function to increase the appropriate counter
 * @param {boolean} mustShow if the modal must be shown
 * @param {boolean} hasRepeats if the counters has repeats
 * @return {(function(*, *): void)|*}
 */
export function showModal(resetAction, increaseAction, mustShow, hasRepeats) {
  return async (dispatch, getState) => {
    if (!mustShow && hasRepeats && increaseAction) {
      dispatch(increaseAction());
    }

    if (!(mustShow && hasRepeats)) {
      return;
    }

    const state = getAppRatingState(getState());

    const isMinDaysBetweenPopupsElapsed = (Date.now() - state.lastPopupAt) >=
      (minDaysBetweenPopups * TIMER_TIMESPAN);

    if (!isMinDaysBetweenPopupsElapsed) {
      return;
    }

    dispatch(resetAction());
    dispatch(setLastPopupTimestamp());

    const firstModalConfirmed = await dispatch(showModalAction({
      confirm: 'appRating.yes',
      dismiss: 'appRating.no',
      title: 'appRating.title',
      message: 'appRating.message',
    }));

    /*
        Tracking placeholder
    */

    // user touched yes and we
    // redirect to store
    if (firstModalConfirmed) {
      dispatch(confirmModal());
      return;
    }

    // user doesn't want to rate
    dispatch(increaseRejectionCount());

    // we approve for rejection
    if (approveRejection) {
      const rejectionConfirmed = await dispatch(showModalAction({
        confirm: 'appRating.yes',
        dismiss: 'appRating.no',
        title: 'appRating.title',
        message: 'appRating.rejectionApprovalMessage',
      }));

      // user now wants to rate our app! yay :D
      if (rejectionConfirmed) {
        dispatch(confirmModal());
        return;
      }
    }

    /*
        Tracking placeholder
    */

    // the user doesn't really want to give us a rate :(
    dispatch(rejectModal());
  };
}
