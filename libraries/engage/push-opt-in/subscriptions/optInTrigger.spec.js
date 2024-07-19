import { combineReducers } from 'redux';
import merge from 'lodash/merge';
import { createMockStore } from '@shopgate/pwa-common/store';
import { getAppPermissions } from '@shopgate/pwa-core/commands/appPermissions';
import { event } from '@shopgate/engage/core';
import {
  PERMISSION_ID_PUSH,
  PERMISSION_STATUS_DENIED,
  PERMISSION_STATUS_GRANTED,
  APP_DID_START,
} from '@shopgate/engage/core/constants';
import {
  appSupportsPushOptIn,
  hasSGJavaScriptBridge,
  createMockedPermissions,
  logger,
} from '@shopgate/engage/core/helpers';
import {
  increaseAppStartCount,
  setLastPopupTimestamp,
  resetAppStartCount,
  increaseRejectionCount,
  increaseOrdersPlacedCount,
  resetOrdersPlacedCount,
  optInPostponed,
  showPushOptInModal,
} from '../action-creators';
import pushReducers from '../reducers';
import subscriptions from './optInTrigger';

import { UPDATE_COOKIE_CONSENT } from '../../tracking/constants';

/**
 * @typedef {Object} MockedConfigSetting
 * @property {number} value
 * @property {number|null} repeats
 */

/**
 * @typedef {Object} MockedConfig
 * @property {MockedConfigSetting} appStarts
 * @property {MockedConfigSetting} ordersPlaced
 * @property {number} rejectionMaxCount
 * @property {number} minDaysBetweenOptIns
 */

let mockedPushOptInConfig;

/**
 * Updates the mocked pushOptIn config with custom values.
 * @param {MockedConfig} update The custom config values
 */
const setMockedConfig = (update = {}) => {
  mockedPushOptInConfig = merge({
    appStarts: {
      value: 1,
      repeats: null,
    },
    ordersPlaced: {
      value: 1,
      repeats: null,
    },
    rejectionMaxCount: 2,
    minDaysBetweenOptIns: 1,
  }, update);
};

jest.mock('../action-creators/pushOptIn.js', () => ({
  showPushOptInModal: jest.fn(),
}));

jest.mock('@shopgate/engage', () => ({
  appConfig: {
    get pushOptIn() { return mockedPushOptInConfig; },
  },
}));

jest.mock('@shopgate/engage/core/classes', () => ({
  event: {
    addCallback: jest.fn(),
  },
}));

jest.mock('@shopgate/pwa-core/commands/appPermissions', () => {
  const {
    PERMISSION_STATUS_NOT_DETERMINED,
  } = jest.requireActual('@shopgate/pwa-core/constants/AppPermissions');

  return {
    getAppPermissions: jest.fn().mockResolvedValue([{ status: PERMISSION_STATUS_NOT_DETERMINED }]),
  };
});

jest.mock('@shopgate/engage/core/helpers', () => ({
  appSupportsPushOptIn: jest.fn().mockReturnValue(true),
  logger: {
    error: jest.fn(),
  },
  hasSGJavaScriptBridge: jest.fn(() => true),
  hasWebBridge: jest.fn(() => false),
  createMockedPermissions: jest.fn(() => 'mockedPermissions'),
}));

describe('Push OptIn Subscriptions', () => {
  const subscribe = jest.fn();
  let dispatch;
  let getState;
  let callbackParams;
  const mockedTS = new Date('2024-01-31T12:00:00.000Z').getTime();
  let dateMock;

  beforeEach(() => {
    setMockedConfig();

    jest.clearAllMocks();

    const store = createMockStore(
      combineReducers({ pushOptIn: pushReducers }),
      subscriptions
    );

    jest.spyOn(store, 'dispatch');
    jest.spyOn(store, 'getState');

    dateMock = jest.spyOn(Date, 'now').mockImplementation(() => mockedTS);

    ({ dispatch, getState } = store);

    callbackParams = {
      dispatch,
      getState,
    };

    subscriptions(subscribe);

    // By default dispatching the showPushOptInModal action results
    // into dispatching the optInPostponed action
    showPushOptInModal.mockImplementation(() => (thunkDispatch) => {
      thunkDispatch(optInPostponed());
    });
  });

  /**
   * Since subscriptions for handling appStarts and ordersPlaced settings share the same logic and
   * just operate on different properties of the related app config, both test blocks are equal
   * can can be executed in a loop.
   */
  describe.each([
    'appStarts',
    'ordersPlaced',
  ])(
    'Counter tests', (configType) => {
      describe(`Logic for ${configType}`, () => {
        let callback;
        let eventName;
        let increaseCountAction;
        let resetCountAction;

        beforeEach(async () => {
          if (configType === 'appStarts') {
            // Pick the callback of the subscriptions for handling of the appStarts setting
            [[, callback]] = subscribe.mock.calls;

            increaseCountAction = increaseAppStartCount;
            resetCountAction = resetAppStartCount;
          } else if (configType === 'ordersPlaced') {
            // Pick the callback of the subscriptions for handling of the ordersPlaced setting
            const [, [, subscribeCallback]] = subscribe.mock.calls;
            // Invoke the callback, so that an event handler for "checkoutSuccess" is registered
            await subscribeCallback(callbackParams);
            // Pick the event handler
            ([[eventName, callback]] = event.addCallback.mock.calls);

            increaseCountAction = increaseOrdersPlacedCount;
            resetCountAction = resetOrdersPlacedCount;
          }
        });

        if (configType === 'ordersPlaced') {
          it('should register for the expected event', () => {
            expect(eventName).toBe('checkoutSuccess');
          });
        }

        it('should not trigger opt-in when push permission has not status "notDetermined" anymore', async () => {
          setMockedConfig({
            [configType]: {
              value: 1,
            },
          });

          getAppPermissions.mockResolvedValueOnce([{ status: PERMISSION_STATUS_DENIED }]);

          await callback(callbackParams);

          expect(getAppPermissions).toHaveBeenCalled();
          expect(getAppPermissions).toHaveBeenCalledWith([PERMISSION_ID_PUSH], undefined);

          expect(dispatch).toHaveBeenCalledTimes(1);
        });

        it('should not trigger opt-in when config key is set to 0', async () => {
          setMockedConfig({
            [configType]: {
              value: 0,
            },
          });

          await callback(callbackParams);

          expect(getAppPermissions).toHaveBeenCalled();
          expect(getAppPermissions).toHaveBeenCalledWith([PERMISSION_ID_PUSH], undefined);

          expect(dispatch).toHaveBeenCalledTimes(2);
          expect(dispatch).toHaveBeenCalledWith(increaseCountAction());

          expect(showPushOptInModal).not.toHaveBeenCalled();
        });

        it('should trigger opt-in at the first counter increase', async () => {
          setMockedConfig({
            [configType]: {
              value: 1,
            },
          });

          await callback(callbackParams);

          expect(getAppPermissions).toHaveBeenCalled();
          expect(getAppPermissions).toHaveBeenCalledWith([PERMISSION_ID_PUSH], undefined);

          expect(dispatch).toHaveBeenCalledTimes(5);
          expect(dispatch).toHaveBeenCalledWith(increaseCountAction());
          expect(dispatch).toHaveBeenCalledWith(setLastPopupTimestamp());
          expect(dispatch).toHaveBeenCalledWith(resetCountAction());
          expect(showPushOptInModal).toHaveBeenCalledTimes(1);
        });

        it('should trigger opt-in at the 3rd counter increase', async () => {
          setMockedConfig({
            [configType]: {
              value: 3,
            },
          });

          // 1st counter increase -> do not show opt-in
          await callback(callbackParams);
          expect(dispatch).toHaveBeenCalledTimes(2);
          expect(showPushOptInModal).not.toHaveBeenCalled();

          // 2nd counter increase -> do not show opt-in
          await callback(callbackParams);
          expect(dispatch).toHaveBeenCalledTimes(4);
          expect(showPushOptInModal).not.toHaveBeenCalled();

          // 3rd counter increase -> show opt-in
          await callback(callbackParams);
          expect(dispatch).toHaveBeenCalledTimes(9);
          expect(showPushOptInModal).toHaveBeenCalledTimes(1);
        });

        it('should not trigger opt-in when the app does not support push opt-in', async () => {
          appSupportsPushOptIn.mockReturnValueOnce(false);
          await callback(callbackParams);

          expect(dispatch).not.toBeCalled();
          expect(showPushOptInModal).not.toHaveBeenCalled();
        });

        it('should not trigger opt-in again till "minDaysBetweenOptIns" elapsed', async () => {
          setMockedConfig({
            [configType]: {
              value: 1,
            },
            minDaysBetweenOptIns: 1,
          });

          // 1st counter increase -> show opt-in
          await callback(callbackParams);
          expect(showPushOptInModal).toHaveBeenCalledTimes(1);

          // fast forward time by 1/2 day
          dateMock.mockImplementation(() => mockedTS + (1000 * 60 * 60 * 12));

          // 2nd counter increase -> do not show opt due to min days setting
          await callback(callbackParams);
          expect(showPushOptInModal).toHaveBeenCalledTimes(1);

          // 3rd counter increase -> do not show opt due to min days setting
          await callback(callbackParams);
          expect(showPushOptInModal).toHaveBeenCalledTimes(1);

          // fast forward time by 1 day
          dateMock.mockImplementation(() => mockedTS + (1000 * 60 * 60 * 24));

          // 4th counter increase -> show opt-in again
          await callback(callbackParams);
          expect(showPushOptInModal).toHaveBeenCalledTimes(2);
        });

        it('should not trigger opt-in when max rejection count is reached', async () => {
          setMockedConfig({
            [configType]: {
              value: 1,
            },
            minDaysBetweenOptIns: 0,
            rejectionMaxCount: 2,
          });

          // 1st counter increase -> show opt-in
          await callback(callbackParams);
          expect(showPushOptInModal).toHaveBeenCalledTimes(1);

          // 2nd counter increase -> show opt-in
          await callback(callbackParams);
          expect(showPushOptInModal).toHaveBeenCalledTimes(2);

          // 3rd counter increase -> no opt-in due to rejection count
          await callback(callbackParams);
          expect(showPushOptInModal).toHaveBeenCalledTimes(2);
        });

        it('should not trigger opt-in when max repeats are reached', async () => {
          setMockedConfig({
            [configType]: {
              value: 2,
              repeats: 2,
            },
            minDaysBetweenOptIns: 0,
            rejectionMaxCount: 4,
          });

          await callback(callbackParams);
          // 2nd counter increase -> show opt-in
          await callback(callbackParams);
          expect(showPushOptInModal).toHaveBeenCalledTimes(1);

          await callback(callbackParams);
          // 4th counter increase -> show opt-in
          await callback(callbackParams);
          expect(showPushOptInModal).toHaveBeenCalledTimes(2);

          await callback(callbackParams);
          // 6th counter increase -> show opt-in
          await callback(callbackParams);
          expect(showPushOptInModal).toHaveBeenCalledTimes(3);

          await callback(callbackParams);
          // 8th counter increase -> no opt-in due to max repeats reached
          await callback(callbackParams);
          expect(showPushOptInModal).toHaveBeenCalledTimes(3);
        });

        it('should inject a dispatch mock in development', async () => {
          hasSGJavaScriptBridge.mockReturnValueOnce(false);

          setMockedConfig({
            [configType]: {
              value: 1,
            },
          });

          await callback(callbackParams);

          expect(getAppPermissions).toHaveBeenCalled();
          expect(getAppPermissions).toHaveBeenCalledWith([PERMISSION_ID_PUSH], 'mockedPermissions');
          expect(createMockedPermissions).toHaveBeenCalledTimes(1);
          expect(createMockedPermissions).toHaveBeenCalledWith(PERMISSION_STATUS_GRANTED);
        });
      });
    }
  );

  describe('Combined counter tests', () => {
    let appStartsSubscriberCallback;
    let ordersPlacedSubscriberCallback;

    beforeEach(() => {
      [
        [, appStartsSubscriberCallback],
        [, ordersPlacedSubscriberCallback],
      ] = subscribe.mock.calls;
    });

    it('should trigger opt-in for ordersPlaced when max views for appStarts already exceeded', async () => {
      setMockedConfig({
        appStarts: {
          value: 1,
          repeats: 2,
        },
        ordersPlaced: {
          value: 1,
          repeats: 1,
        },
        minDaysBetweenOptIns: 0,
        rejectionMaxCount: 4,
      });

      // 3 opt-ins can be triggered before opt-in by appStart is exceeded (initial + 2 repeats)
      await appStartsSubscriberCallback(callbackParams);
      expect(showPushOptInModal).toHaveBeenCalledTimes(1);

      await appStartsSubscriberCallback(callbackParams);
      expect(showPushOptInModal).toHaveBeenCalledTimes(2);

      await appStartsSubscriberCallback(callbackParams);
      expect(showPushOptInModal).toHaveBeenCalledTimes(3);

      // Opt-in does't show anymore for 4th app start since repeats exceeded
      await appStartsSubscriberCallback(callbackParams);
      expect(showPushOptInModal).toHaveBeenCalledTimes(3);

      ordersPlacedSubscriberCallback(callbackParams);

      const [[, checkoutSuccessCallback]] = event.addCallback.mock.calls;

      // Opt-in shows again since max rejection count is not reached yet
      await checkoutSuccessCallback();
      expect(showPushOptInModal).toHaveBeenCalledTimes(4);

      // Opt-in doesn't show anymore for the 2nd order placement, since max rejection count exceeded
      await checkoutSuccessCallback();
      expect(showPushOptInModal).toHaveBeenCalledTimes(4);
    });
  });

  describe('cookieConsentInitialized$', () => {
    it('should run expected logic when cookieConsentInitialized$ stream emits', () => {
      setMockedConfig({
        appStarts: {
          value: 1,
          repeats: 1,
        },
        ordersPlaced: {
          value: 1,
          repeats: 1,
        },
        minDaysBetweenOptIns: 0,
      });

      // TODO replace with UPDATE_COOKIE_CONSENT after cookie consent feature is merged
      dispatch({ type: APP_DID_START });

      // getAppPermissions should have been called 1st time for appDidStart
      expect(getAppPermissions).toHaveBeenCalledTimes(1);

      const [[eventName, eventCallback]] = event.addCallback.mock.calls;
      expect(eventName).toBe('checkoutSuccess');
      eventCallback();

      // getAppPermissions should have been called 2nd time for checkoutSuccess event
      expect(getAppPermissions).toHaveBeenCalledTimes(2);

      // TODO remove conditional after cookie consent feature is merged
      // Verify that opt in is only initialized once
      if (false) {
        dispatch({ type: UPDATE_COOKIE_CONSENT });
        expect(getAppPermissions).toHaveBeenCalledTimes(2);
      }
    });
  });

  describe('increaseRejectionCount$', () => {
    let callback;

    beforeEach(() => {
      [,, [, callback]] = subscribe.mock.calls;
    });

    it('should dispatch the increaseRejectionCount action when subscription emits', () => {
      callback(callbackParams);
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith(increaseRejectionCount());
    });
  });

  describe('Config test', () => {
    let callback;

    beforeEach(() => {
      [[, callback]] = subscribe.mock.calls;
    });

    it('should log an error when config is undefined', async () => {
      mockedPushOptInConfig = undefined;
      await callback(callbackParams);

      expect(dispatch).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledTimes(1);
    });

    it('should log an error when config is appStarts property is not an object', async () => {
      mockedPushOptInConfig.appStarts = 42;
      await callback(callbackParams);

      expect(dispatch).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledTimes(1);
    });

    it('should log an error when config is ordersPlaced property is not an object', async () => {
      mockedPushOptInConfig.ordersPlaced = 42;
      await callback(callbackParams);

      expect(dispatch).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledTimes(1);
    });

    it('should log an error when config is rejectionMaxCount property is not a number', async () => {
      mockedPushOptInConfig.rejectionMaxCount = null;
      await callback(callbackParams);

      expect(dispatch).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledTimes(1);
    });

    it('should log an error when config is minDaysBetweenOptIns property is not a number', async () => {
      mockedPushOptInConfig.minDaysBetweenOptIns = null;
      await callback(callbackParams);

      expect(dispatch).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledTimes(1);
    });
  });
});
