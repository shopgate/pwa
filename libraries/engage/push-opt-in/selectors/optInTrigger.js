import { createSelector } from 'reselect';
import { appSupportsPushOptIn } from '@shopgate/engage/core/helpers';
import { appConfig } from '@shopgate/engage';
import { getPushOptInModalTriggerType } from './optInModal';

/**
 * Selects the push opt in information.
 * @param {Object} state The current state.
 * @returns {Object} The push opt in information.
 */
export const getPushOptInTriggerState = state => state?.pushOptIn?.optInTrigger || {};

/**
 * Creates a meta data object for push opt in tracking events
 */
export const getPushOptInTrackingMeta = createSelector(
  getPushOptInModalTriggerType,
  getPushOptInTriggerState,
  (triggerType, triggerState) => {
    const {
      pushOptIn: {
        appStarts: { value: appStartsVal = 0 } = {},
        ordersPlaced: { value: ordersPlacedVal = 0 } = {},
      } = {},
    } = appConfig;

    const usesSoftPushOptIn = appSupportsPushOptIn() && (appStartsVal > 0 || ordersPlacedVal > 0);

    if (triggerType === 'ordersPlaced') {
      return {
        permission: 'push',
        context: 'checkoutSuccess',
        contextCounter: triggerState.ordersPlacedCountAbs,
        usesSoftPushOptIn,
      };
    }

    return {
      permission: 'push',
      context: 'appStart',
      contextCounter: triggerState.appStartCountAbs,
      usesSoftPushOptIn,
    };
  }
);
