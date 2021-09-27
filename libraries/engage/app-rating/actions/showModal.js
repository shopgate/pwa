import showModalAction from '@shopgate/pwa-common/actions/modal/showModal';
import { getPlatform } from '@shopgate/pwa-common/selectors/client';
import { historyPush } from '@shopgate/pwa-common/actions/router';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { track } from '@shopgate/pwa-tracking/helpers';
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
    minDaysBetweenPopups,
    askForFeedback,
    feedbackLink,
  },
} = appConfig;

/**
 * to handle the modal confirmation
 * @param {string} url the url to redirect to
 * @param {boolean | null} setRated the url to redirect to
 * @return {(function(*, *): void)|*}
 */
function confirmModal(url, setRated = false) {
  return (dispatch) => {
    if (!url) {
      return;
    }

    if (setRated) {
      dispatch(setAlreadyRated(setRated));
    }

    dispatch(historyPush({
      pathname: url,
    }));
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

    const state = getState();
    const appRatingState = getAppRatingState(state);

    const isMinDaysBetweenPopupsElapsed = (Date.now() - appRatingState.lastPopupAt) >=
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

    track('customEvent', {
      eventCategory: 'appReviewPrompt',
      eventAction: 'decision',
      eventLabel: firstModalConfirmed ? 'yes' : 'no',
    }, state);

    // user touched yes and we
    // redirect to store
    if (firstModalConfirmed) {
      const platform = getPlatform(getState());
      const link = generateReviewLink(bId[platform], platform);

      dispatch(confirmModal(link, true));
      return;
    }

    // user doesn't want to rate
    dispatch(increaseRejectionCount());

    // we approve for rejection
    if (askForFeedback) {
      const userGivesFeedback = await dispatch(showModalAction({
        confirm: 'appRating.yes',
        dismiss: 'appRating.no',
        title: 'appRating.title',
        message: 'appRating.rejectionApprovalMessage',
      }));

      track('customEvent', {
        eventCategory: 'appReviewPrompt',
        eventAction: 'decision_feedback',
        eventLabel: userGivesFeedback ? 'yes' : 'no',
      }, state);

      // user now wants to rate our app! yay :D
      if (userGivesFeedback) {
        dispatch(confirmModal(feedbackLink));
      }
    }
  };
}
