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
    minTimeBetweenPopups,
  },
} = appConfig;

/**
 * shows the actual modal
 * @param {Function} resetAction the reset action function
 * @param {Function} increaseAction the function to increase the appropriate counter
 * @param {boolean} mustShow if the modal must be shown
 * @param {boolean} hasRepeats if the counters has repeats
 * @return {(function(*, *): void)|*}
 */
export function showModal(resetAction, increaseAction, mustShow, hasRepeats) {
  return (dispatch, getState) => {
    if (!mustShow && hasRepeats && increaseAction) {
      dispatch(increaseAction());
    }

    if (!(mustShow && hasRepeats)) {
      return;
    }

    const state = getAppRatingState(getState());

    const isMinTimeBetweenPopupsElapsed = (Date.now() - state.lastPopupAt) >=
      (minTimeBetweenPopups * TIMER_TIMESPAN);

    if (!isMinTimeBetweenPopupsElapsed) {
      return;
    }

    dispatch(resetAction());
    dispatch(setLastPopupTimestamp());

    dispatch(showModalAction({
      confirm: 'appRating.yes',
      dismiss: 'appRating.no',
      title: 'appRating.title',
      message: 'appRating.message',
    })).then((confirmed) => {
      // user touched yes and we
      // redirect to store
      if (confirmed) {
        const platform = getPlatform(getState());
        const link = generateReviewLink(bId[platform], platform);
        if (!link) {
          return;
        }

        dispatch(setAlreadyRated(true));
        dispatch(historyPush({
          pathname: link,
        }));
        return;
      }

      // user doesn't want to rate
      dispatch(increaseRejectionCount());
      if (rejectionLink) {
        dispatch(historyPush({
          pathname: rejectionLink,
        }));
      }
    });
  };
}
