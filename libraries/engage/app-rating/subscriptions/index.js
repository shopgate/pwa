import appConfig from '@shopgate/pwa-common/helpers/config';
import { appDidStart$ } from '@shopgate/pwa-common/streams/app';
import event from '@shopgate/pwa-core/classes/Event';
import { increaseAppStartCount, resetAppStartCount } from '../action-creators/appStart';
import { increaseOrdersPlacedCount, resetOrdersPlacedCount } from '../action-creators/ordersPlaced';
import {
  resetTimerState,
  setTimerStartTime,
} from '../action-creators/timer';
import { TIMER_TIMESPAN } from '../constants';
import { isMinTimeBetweenPopupsElapsed, showModal } from '../helpers';
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
    if (!state) {
      return;
    }

    // initiate the first start time
    if (state.timerStartTimestamp === null) {
      dispatch(setTimerStartTime());
    }

    let mustShowModal;
    let hasRepeats;
    let resetAction;

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
    } else {
      mustShowModal = state.appStartCount >= appStarts.value;
      hasRepeats = appStarts.repeats === null || state.appStartResetCount < appStarts.repeats;
      resetAction = resetAppStartCount;
    }

    // the actual show modal logic
    if (mustShowModal && hasRepeats) {
      // we check if the minimum time
      // between popups is already elapsed
      if (!isMinTimeBetweenPopupsElapsed(state)) {
        return;
      }

      showModal(state, dispatch, resetAction);
    }
  });

  // event subscriber to handle order placed ratings
  subscribe(appDidStart$, ({ dispatch, getState }) => {
    event.addCallback('checkoutSuccess', () => {
      const state = getAppRatingState(getState());

      // cancel the process if user has
      // already rejected rating the app
      // many times before
      if (!state) {
        return;
      }

      // orders placed count starts from 0
      const mustShowModal = state.ordersPlacedCount === ordersPlaced.value - 1;
      const hasRepeats = ordersPlaced.repeats === null ||
        state.ordersPlacedResetCount < ordersPlaced.repeats;

      if (!mustShowModal && hasRepeats) {
        dispatch(increaseOrdersPlacedCount());
      }

      if (mustShowModal && hasRepeats) {
        if (!isMinTimeBetweenPopupsElapsed(state)) {
          return;
        }

        showModal(state, dispatch, resetOrdersPlacedCount);
      }
    });
  });
}
