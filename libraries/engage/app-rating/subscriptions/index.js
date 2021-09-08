import appConfig from '@shopgate/pwa-common/helpers/config';
import { appDidStart$ } from '@shopgate/pwa-common/streams/app';
import showModalAction from '@shopgate/pwa-common/actions/modal/showModal';
import event from '@shopgate/pwa-core/classes/Event';
import { increaseAppStartCount, resetAppStartCount } from '../action-creators/appStart';
import { increaseOrdersPlacedCount, resetOrdersPlacedCount } from '../action-creators/ordersPlaced';
import {
  resetTimerState,
  setTimerStartTime,
} from '../action-creators/timer';
import { TIMER_TIMESPAN } from '../constants';
import { increaseRejectionCount, setLastPopupTimestamp } from '../action-creators/popup';
import { useNavigation } from '../../core';
import { getPlatform } from '../../../common/selectors/client';
import { generateReviewLink } from '../helpers';
import getAppRatingState from '../selectors/appRating';

/**
 * App rating subscriptions
 * @param {Function} subscribe The subscribe function
 */
export default function appRating(subscribe) {
  const {
    appRating: {
      appStarts,
      ordersPlaced,
      timeInterval,
      minTimeBetweenPopups,
      rejectionMaxCount,
      bundleId,
    },
  } = appConfig;

  // even subscriber to handle app start ratings
  // and also time interval ratings
  subscribe(appDidStart$, ({ dispatch, getState }) => {
    // every time the app starts
    // we increase the start count
    dispatch(increaseAppStartCount());

    const state = getAppRatingState(getState());

    // cancel the process if user has
    // already rejected rating the app
    // many times before
    if (state.rejectionCount >= rejectionMaxCount) {
      return;
    }

    // initiate the first start time
    if (state.timerStartTimestamp === null) {
      dispatch(setTimerStartTime());
    }

    let mustShowModal;
    let hasRepeats;
    let resetAction;
    let rule;

    if (
      Number(state.timerStartTimestamp) > 0 &&
      Date.now() - state.timerStartTimestamp >= (timeInterval.value * TIMER_TIMESPAN)
    ) {
      mustShowModal = true;
      hasRepeats = timeInterval.repeats === null || state.timerRepeatsCount < timeInterval.repeats;
      resetAction = resetTimerState;

      // since the time is elapsed
      // we reset the starting time
      dispatch(setTimerStartTime());
      rule = timeInterval;
    } else {
      mustShowModal = state.appStartCount >= appStarts.value;
      hasRepeats = appStarts.repeats === null || state.appStartResetCount < appStarts.repeats;
      resetAction = resetAppStartCount;
      rule = appStarts;
    }

    // the actual show modal logic
    if (mustShowModal && hasRepeats) {
      // we check if the minimum time
      // between popups is already elapsed
      const minTimeBetweenPopupsElapsed =
        (Date.now() - state.lastPopupAt) >=
        (minTimeBetweenPopups * TIMER_TIMESPAN);

      if (!minTimeBetweenPopupsElapsed) {
        return;
      }

      // reset the counters
      dispatch(resetAction());
      dispatch(setLastPopupTimestamp());

      // show the dialog
      dispatch(showModalAction({
        confirm: 'appRating.yes',
        dismiss: 'appRating.no',
        title: 'appRating.title',
        message: 'appRating.message',
      })).then((confirmed) => {
        const { push } = useNavigation();

        // user touched yes and we
        // redirect to store
        if (confirmed) {
          const platform = getPlatform(getState());
          const link = generateReviewLink(bundleId[platform], platform);
          if (!link) {
            // TODO: logger with warning (with notice of the configs)
            return;
          }

          push({
            pathname: link,
          });

          return;
        }

        // user doesn't want to rate
        dispatch(increaseRejectionCount());
        if (rule.answerNo) {
          push({
            pathname: rule.answerNo,
          });
        }
      });
    }
  });

  // event subscriber to handle order placed ratings
  subscribe(appDidStart$, ({ dispatch, getState }) => {
    const state = getAppRatingState(getState());

    event.addCallback('checkoutSuccess', () => {
      // cancel the process if user has
      // already rejected rating the app
      // many times before
      if (state.rejectionCount >= rejectionMaxCount) {
        return;
      }

      // orders placed count starts from 0
      const mustShowModal = state.ordersPlacedCount === ordersPlaced.value - 1;
      const hasRepeats = ordersPlaced.repeats === null ||
        state.ordersPlacedResetCount < ordersPlaced.repeats;

      if (!mustShowModal && hasRepeats) {
        dispatch(increaseOrdersPlacedCount());
      }

      // we check if the minimum time
      // between popups is already elapsed
      const minTimeBetweenPopupsElapsed =
        (Date.now() - state.lastPopupAt) >=
        (minTimeBetweenPopups * TIMER_TIMESPAN);

      if (mustShowModal && hasRepeats && minTimeBetweenPopupsElapsed) {
        dispatch(resetOrdersPlacedCount());
        dispatch(setLastPopupTimestamp());

        // @INDICATOR: refactor
        dispatch(showModalAction({
          confirm: 'appRating.yes',
          dismiss: 'appRating.no',
          title: 'appRating.title',
          message: 'appRating.message',
        })).then((confirmed) => {
          const { push } = useNavigation();

          // user touched yes and we
          // redirect to store
          if (confirmed) {
            const platform = getPlatform(getState());
            const link = generateReviewLink(bundleId[platform], platform);
            if (!link) {
              return;
            }

            push({
              pathname: link,
            });

            return;
          }

          // user doesn't want to rate
          dispatch(increaseRejectionCount());
          if (ordersPlaced.answerNo) {
            push({
              pathname: ordersPlaced.answerNo,
            });
          }
        });
      }
    });
  });
}
