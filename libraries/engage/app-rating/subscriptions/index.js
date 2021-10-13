import appConfig from '@shopgate/pwa-common/helpers/config';
import { appDidStart$ } from '@shopgate/pwa-common/streams/app';
import { checkoutSuccess$ } from '@shopgate/engage/checkout/streams';
import event from '@shopgate/pwa-core/classes/Event';
import { hasWebBridge } from '@shopgate/engage/core';
import { increaseAppStartCount, resetAppStartCount } from '../action-creators/appStart';
import { increaseOrdersPlacedCount, resetOrdersPlacedCount } from '../action-creators/ordersPlaced';
import {
  resetTimerState,
  setTimerStartTime,
} from '../action-creators/timer';
import { TIMER_TIMESPAN } from '../constants';
import { getAppRatingState } from '../selectors/appRating';
import { showModal } from '../actions/showModal';

/**
 * App rating subscriptions
 * @param {Function} subscribe The subscribe function
 */
export default function appRating(subscribe) {
  if (!hasWebBridge) {
    return;
  }

  const {
    appRating: {
      appStarts,
      ordersPlaced,
      timeInterval,
      rejectionMaxCount,
      bundleId,
    },
  } = appConfig;

  // even subscriber to handle app start ratings
  // and also time interval ratings
  subscribe(appDidStart$, async ({ dispatch, getState }) => {
    if (!bundleId || !bundleId.android || !bundleId.ios) {
      return;
    }
    // every time the app starts
    // we increase the start count
    dispatch(increaseAppStartCount());

    const state = getAppRatingState(getState());

    // if the user has already rated the app
    // we'll cancel the operations as we
    // don't have to show the modal once more
    if (state.alreadyRated) {
      return;
    }

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

    let mustShowModal = false;
    let hasRepeats = false;
    let resetAction = null;
    let increaseAction = null;

    if (
      Number(timeInterval.value) > 0 &&
      Number(state.timerStartTimestamp) > 0 &&
      Date.now() - state.timerStartTimestamp >= (timeInterval.value * TIMER_TIMESPAN)
    ) {
      mustShowModal = true;
      hasRepeats = timeInterval.repeats === null || state.timerRepeatsCount <= timeInterval.repeats;
      resetAction = resetTimerState;

      // since the time is elapsed
      // we reset the starting time
      increaseAction = setTimerStartTime;
    } else if (appStarts) {
      mustShowModal = Number(appStarts.value) > 0 && state.appStartCount >= appStarts.value;
      hasRepeats = appStarts.repeats === null || state.appStartResetCount <= appStarts.repeats;
      resetAction = resetAppStartCount;
      increaseAction = null;
    }

    // the actual show modal logic
    dispatch(showModal(
      resetAction,
      increaseAction,
      mustShowModal,
      hasRepeats
    ));
  });

  /**
   * Handle checkout success logic
   * @param {Function} dispatch dispatch
   * @param {Function} getState getState
   */
  const handleCheckoutSuccess = (dispatch, getState) => {
    if (!bundleId || !bundleId.android || !bundleId.ios) {
      return;
    }

    const state = getAppRatingState(getState());

    // if the user has already rated the app
    // we'll cancel the operations as we
    // don't have to show the modal once more
    if (state.alreadyRated) {
      return;
    }

    // cancel the process if user has
    // already rejected rating the app
    // many times before
    if (state.rejectionCount >= rejectionMaxCount) {
      return;
    }

    if (!ordersPlaced) {
      return;
    }

    // orders placed count starts from 0
    const mustShowModal = state.ordersPlacedCount === ordersPlaced.value - 1;
    const hasRepeats = ordersPlaced.repeats === null ||
      state.ordersPlacedResetCount <= ordersPlaced.repeats;

    dispatch(showModal(
      resetOrdersPlacedCount,
      increaseOrdersPlacedCount,
      mustShowModal,
      hasRepeats
    ));
  };

  // subscriber to handle order placed ratings from native checkout
  subscribe(checkoutSuccess$, ({ dispatch, getState }) => {
    handleCheckoutSuccess(dispatch, getState);
  });

  // event subscriber to handle order placed ratings from webcheckout
  subscribe(appDidStart$, ({ dispatch, getState }) => {
    event.addCallback('checkoutSuccess', () => {
      handleCheckoutSuccess(dispatch, getState);
    });
  });
}
