import {
  appConfig,
} from '@shopgate/engage';
import {
  main$,
  appDidStart$,
} from '@shopgate/engage/core/streams';
import {
  event,
} from '@shopgate/engage/core/classes';
import {
  appSupportsPushOptIn,
  logger,
} from '@shopgate/engage/core/helpers';
import {
  PERMISSION_ID_PUSH,
  PERMISSION_STATUS_NOT_DETERMINED,
} from '@shopgate/engage/core/constants';
import { requestAppPermissionStatus } from '@shopgate/engage/core/actions';
// TODO replace appDidStart$ with cookieConsentInitialized$ after cookie consent feature is merged
// import { cookieConsentInitialized$ } from '@shopgate/engage/tracking/streams';
import {
  increaseAppStartCount,
  resetAppStartCount,
  increaseOrdersPlacedCount,
  resetOrdersPlacedCount,
  setLastPopupTimestamp,
  increaseRejectionCount,
  showPushOptInModal,
} from '../action-creators';
import {
  PUSH_OPT_IN_OPT_IN_POSTPONED,
} from '../constants';

import { getPushOptInTriggerState } from '../selectors';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

const increaseRejectionCount$ = main$.filter(
  ({ action }) => action.type === PUSH_OPT_IN_OPT_IN_POSTPONED
);

/**
 * Push opt in subscriptions
 * @param {Function} subscribe The subscribe function
 */
export default function pushOptIn(subscribe) {
  /**
   * @param {Object} subscriptionParams Params from the subscription callback
   * @param {string} configKey The "pushOptIn" key to be used
   * @param {Function} increaseCountAction Action to increase the count in Redux for the configKey
   * @returns {void}
   */
  const showOptInAfterChecks = async ({ dispatch, getState }, configKey, increaseCountAction) => {
    if (!appSupportsPushOptIn()) {
      // Do nothing when the app doesn't support the features needed for the push-opt-in
      return;
    }

    const {
      pushOptIn: {
        appStarts,
        ordersPlaced,
        rejectionMaxCount,
        minDaysBetweenOptIns,
      } = {},
    } = appConfig;

    // Deactivate feature when config is invalid
    if (
      typeof minDaysBetweenOptIns !== 'number' ||
      typeof rejectionMaxCount !== 'number' ||
      typeof ordersPlaced !== 'object' ||
      typeof appStarts !== 'object'
    ) {
      logger.error('PushOptInTrigger - Config invalid', appConfig?.pushOptIn);
      return;
    }

    const { status: pushStatus } = await dispatch(requestAppPermissionStatus({
      permissionId: PERMISSION_ID_PUSH,
    }));

    if (pushStatus !== PERMISSION_STATUS_NOT_DETERMINED) {
      return;
    }

    dispatch(increaseCountAction());

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
      dispatch(showPushOptInModal());
    }
  };

  // event subscriber to handle app start based push opt in
  subscribe(appDidStart$, async ({ dispatch, getState }) => {
    await showOptInAfterChecks({
      dispatch,
      getState,
    }, 'appStarts', increaseAppStartCount);
  });

  // event subscriber to handle order based push opt in
  subscribe(appDidStart$, ({ dispatch, getState }) => {
    event.addCallback('checkoutSuccess', async () => {
      await showOptInAfterChecks({
        dispatch,
        getState,
      }, 'ordersPlaced', increaseOrdersPlacedCount);
    });
  });

  subscribe(increaseRejectionCount$, ({ dispatch }) => {
    dispatch(increaseRejectionCount());
  });
}
