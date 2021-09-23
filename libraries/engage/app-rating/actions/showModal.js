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
      // @INDICATOR
      dispatch(showModalAction({
        confirm: 'appRating.yes',
        dismiss: 'appRating.no',
        title: 'Testing',
        message: JSON.stringify({ mustShow, hasRepeats, increaseAction }),
      }));
      dispatch(increaseAction());
    }

    if (!(mustShow && hasRepeats)) {
      // @INDICATOR
      dispatch(showModalAction({
        confirm: 'appRating.yes',
        dismiss: 'appRating.no',
        title: 'Testing',
        message: JSON.stringify({ mustShow, hasRepeats }),
      }));
      return;
    }

    const state = getAppRatingState(getState());

    const isMinDaysBetweenPopupsElapsed = (Date.now() - state.lastPopupAt) >=
      (minDaysBetweenPopups * TIMER_TIMESPAN);

    if (!isMinDaysBetweenPopupsElapsed) {
      // @INDICATOR
      dispatch(showModalAction({
        confirm: 'appRating.yes',
        dismiss: 'appRating.no',
        title: 'Testing',
        message: JSON.stringify({ isMinDaysBetweenPopupsElapsed }),
      }));
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
        dispatch(showModalAction({
          confirm: 'appRating.yes',
          dismiss: 'appRating.no',
          title: 'Testing',
          message: 'set already rated to true',
        }));
        dispatch(historyPush({
          pathname: link,
        }));
        return;
      }

      // user doesn't want to rate
      dispatch(increaseRejectionCount());
      dispatch(showModalAction({
        confirm: 'appRating.yes',
        dismiss: 'appRating.no',
        title: 'Testing',
        message: 'rejecting',
      }));
      if (rejectionLink) {
        dispatch(showModalAction({
          confirm: 'appRating.yes',
          dismiss: 'appRating.no',
          title: 'Testing',
          message: `rejecting with link ${rejectionLink}`,
        }));
        dispatch(historyPush({
          pathname: rejectionLink,
        }));
      }
    });
  };
}
