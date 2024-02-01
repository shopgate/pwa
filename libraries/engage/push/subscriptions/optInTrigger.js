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

import { getPushOptInTriggerState } from '../selectors';
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
   * @param {Function} countIncreaseAction Action to increase the count in Redux for the configKey
   * @returns {void}
   */
  const runChecks = async ({ dispatch, getState }, configKey, countIncreaseAction) => {
    const {
      pushOptIn: {
        appStarts,
        ordersPlaced,
        rejectionMaxCount,
        minDaysBetweenOptIns,
      },
    } = appConfig;

    const [{ status: pushStatus }] = await getAppPermissions([PERMISSION_ID_PUSH]);

    if (pushStatus !== PERMISSION_STATUS_NOT_DETERMINED) {
      return;
    }

    dispatch(countIncreaseAction());

    const state = getPushOptInTriggerState(getState());

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
    await runChecks({
      dispatch,
      getState,
    }, 'appStarts', increaseAppStartCount);
  });

  // event subscriber to handle order based push opt in
  subscribe(appDidStart$, ({ dispatch, getState }) => {
    event.addCallback('checkoutSuccess', async () => {
      await runChecks({
        dispatch,
        getState,
      }, 'ordersPlaced', increaseOrdersPlacedCount);
    });
  });

  subscribe(increaseRejectionCount$, ({ dispatch }) => {
    dispatch(increaseRejectionCount());
  });
}
