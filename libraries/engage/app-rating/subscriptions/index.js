import appConfig from '@shopgate/pwa-common/helpers/config';
import { appDidStart$ } from '@shopgate/pwa-common/streams/app';
import showModalAction from '@shopgate/pwa-common/actions/modal/showModal';
import { MODAL_PIPELINE_ERROR } from '@shopgate/pwa-common/constants/ModalTypes';
import event from '@shopgate/pwa-core/classes/Event';
import { increaseAppStartCount, resetAppStartCount } from '../action-creators/appStart';
import { increaseOrdersPlacedCount, resetOrdersPlacedCount } from '../action-creators/ordersPlaced';
import {
  resetTimerState,
  setTimerStartTime,
} from '../action-creators/timer';
import { TIMER_TIMESPAN } from '../constants';

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
    },
  } = appConfig;

  // even subscriber to handle app start ratings
  // and also time interval ratings
  subscribe(appDidStart$, ({ dispatch, getState }) => {
    const { appRating: state } = getState();

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
      mustShowModal = state.appStartCount === appStarts.value - 1;
      hasRepeats = appStarts.repeats === null || state.appStartResetCount < appStarts.repeats;
      resetAction = resetAppStartCount;

      if (!mustShowModal && hasRepeats) {
        // increase the number of
        // times the app has started
        dispatch(increaseAppStartCount());
      }
    }

    // we check if the minimum time
    // between popups is already elapsed
    const minTimeBetweenPopupsElapsed =
      (Date.now() - state.lastPopupAt) >=
      (minTimeBetweenPopups * TIMER_TIMESPAN);

    if (mustShowModal && hasRepeats && minTimeBetweenPopupsElapsed) {
      dispatch(resetAction());

      // @INDICATOR: refactor
      dispatch(showModalAction({
        confirm: 'modal.ok',
        dismiss: null,
        title: 'test title',
        message: 'test message',
        type: MODAL_PIPELINE_ERROR,
        params: {},
      })).then(console.log);
    }
  });

  // event subscriber to handle order placed ratings
  subscribe(appDidStart$, ({ dispatch, getState }) => {
    const { appRating: state } = getState();

    event.addCallback('checkoutSuccess', () => {
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

        // @INDICATOR: refactor
        dispatch(showModalAction({
          confirm: 'modal.ok',
          dismiss: null,
          title: 'test title',
          message: 'test message',
          type: MODAL_PIPELINE_ERROR,
          params: {},
        })).then(console.log);
      }
    });
  });
}
