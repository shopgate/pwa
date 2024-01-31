import {
  appConfig,
} from '@shopgate/engage';
import {
  main$,
  event,
  appDidStart$,
  getAppPermissions,
  PERMISSION_ID_PUSH,
  PERMISSION_STATUS_NOT_DETERMINED,
} from '@shopgate/engage/core';
import {
  increaseAppStartCount,
  resetAppStartCount,
  increaseOrdersPlacedCount,
  resetOrdersPlacedCount,
  setLastPopupTimestamp,
  increaseRejectionCount,
} from '../action-creators';
import {
  PUSH_OPT_IN_OPT_IN_POSTPONED,
} from '../constants';

import { getPushOptInState } from '../selectors';
import { showOptIn } from '../actions';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

const increaseRejectionCount$ = main$.filter(
  ({ action }) => action.type === PUSH_OPT_IN_OPT_IN_POSTPONED
);

/**
 * App rating subscriptions
 * @param {Function} subscribe The subscribe function
 */
export default function pushOptIn(subscribe) {
  /**
   * @param {Object} subscriptionParams Params from the subscription callback
   * @param {string} configKey The "pushOptIn" key the be used
   * @returns {void}
   */
  const runChecks = async ({ dispatch, getState }, configKey) => {
    const {
      pushOptIn: {
        appStarts,
        ordersPlaced,
        rejectionMaxCount,
        minDaysBetweenOptIns,
      },
    } = appConfig;

    const state = getPushOptInState(getState());

    let configValue = appStarts;
    let resetAction = resetAppStartCount;
    let resetCountState = state.appStartResetCount;
    let configCountState = state.appStartCount;

    if (configKey === 'ordersPlaced') {
      configValue = ordersPlaced;
      resetAction = resetOrdersPlacedCount;
      resetCountState = state.ordersPlacedResetCount;
      configCountState = state.ordersPlacedCount;
    }

    const [{ status: pushStatus }] = await getAppPermissions([PERMISSION_ID_PUSH]);

    if (pushStatus !== PERMISSION_STATUS_NOT_DETERMINED) {
      return;
    }

    if (state.rejectionCount >= rejectionMaxCount) {
      return;
    }

    const mustShowModal = Number(configValue.value) > 0 && configCountState >= configValue.value;
    const hasRepeats = configValue.repeats === null || resetCountState <= configValue.repeats;
    const minDaysElapsed = (Date.now() - state.lastPopupAt) >= (minDaysBetweenOptIns * DAY_IN_MS);

    if (mustShowModal && hasRepeats && minDaysElapsed) {
      dispatch(setLastPopupTimestamp());
      dispatch(resetAction());
      dispatch(showOptIn());
    }
  };

  // event subscriber to handle app start based push opt in
  subscribe(appDidStart$, async ({ dispatch, getState }) => {
    // every time the app starts we increase the start count
    dispatch(increaseAppStartCount());

    await runChecks({
      dispatch,
      getState,
    }, 'appStarts');
  });

  // event subscriber to handle order based push opt in
  subscribe(appDidStart$, ({ dispatch, getState }) => {
    event.addCallback('checkoutSuccess', async () => {
      dispatch(increaseOrdersPlacedCount());

      await runChecks({
        dispatch,
        getState,
      }, 'ordersPlaced');
    });
  });

  subscribe(increaseRejectionCount$, ({ dispatch }) => {
    dispatch(increaseRejectionCount());
  });
}
