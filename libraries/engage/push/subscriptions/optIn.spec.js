import { combineReducers } from 'redux';
import merge from 'lodash/merge';
import { createMockStore } from '@shopgate/pwa-common/store';
import {
  event,
  getAppPermissions,
  PERMISSION_ID_PUSH,
  PERMISSION_STRATUS_DENIED,
} from '@shopgate/engage/core';
import {
  increaseAppStartCount,
  setLastPopupTimestamp,
  resetAppStartCount,
  increaseRejectionCount,
  increaseOrdersPlacedCount,
  resetOrdersPlacedCount,
} from '../action-creators';
import {
  showOptIn,
} from '../actions';
import pushReducers from '../reducers';
import subscription from './optIn';

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

jest.mock('../actions/optIn.js', () => ({
  showOptIn: jest.fn(() => () => {}),
}));

jest.mock('@shopgate/engage', () => ({
  appConfig: {
    get pushOptIn() { return mockedPushOptInConfig; },
  },
}));

jest.mock('@shopgate/engage/core', () => {
  /* eslint-disable no-shadow */
  const {
    appDidStart$,
    main$,
    PERMISSION_ID_PUSH,
    PERMISSION_STATUS_NOT_DETERMINED,
    PERMISSION_STRATUS_GRANTED,
    PERMISSION_STRATUS_DENIED,
  } = jest.requireActual('@shopgate/engage/core');
  /* eslint-enable no-shadow */

  return {
    main$,
    appDidStart$,
    PERMISSION_ID_PUSH,
    PERMISSION_STATUS_NOT_DETERMINED,
    PERMISSION_STRATUS_GRANTED,
    PERMISSION_STRATUS_DENIED,
    getAppPermissions: jest.fn().mockResolvedValue(PERMISSION_STATUS_NOT_DETERMINED),
    event: {
      addCallback: jest.fn(),
    },
  };
});

describe('Push OptIn Subscriptions', () => {
  const subscribe = jest.fn();
  let dispatch;
  let getState;
  let callbackParams;

  beforeEach(() => {
    setMockedConfig();

    jest.clearAllMocks();

    const store = createMockStore(combineReducers({ push: pushReducers }));
    jest.spyOn(store, 'dispatch');
    jest.spyOn(store, 'getState');

    ({ dispatch, getState } = store);

    callbackParams = {
      dispatch,
      getState,
    };
    subscription(subscribe);
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
            // Pick the callback of the subscription for handling of the appStarts setting
            [[, callback]] = subscribe.mock.calls;

            increaseCountAction = increaseAppStartCount;
            resetCountAction = resetAppStartCount;
          } else if (configType === 'ordersPlaced') {
            // Pick the callback of the subscription for handling of the ordersPlaced setting
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

        it('should not trigger opt in when push permission has not status "notDetermined" anymore', async () => {
          setMockedConfig({
            [configType]: {
              value: 1,
            },
          });

          getAppPermissions.mockResolvedValueOnce(PERMISSION_STRATUS_DENIED);

          await callback(callbackParams);

          expect(getAppPermissions).toHaveBeenCalled();
          expect(getAppPermissions).toHaveBeenCalledWith([PERMISSION_ID_PUSH]);

          expect(dispatch).toHaveBeenCalledTimes(1);
          expect(dispatch).toHaveBeenCalledWith(increaseCountAction());
        });

        it('should trigger opt in at the first counter increase', async () => {
          setMockedConfig({
            [configType]: {
              value: 1,
            },
          });

          await callback(callbackParams);

          expect(getAppPermissions).toHaveBeenCalled();
          expect(getAppPermissions).toHaveBeenCalledWith([PERMISSION_ID_PUSH]);

          expect(dispatch).toHaveBeenCalledTimes(4);
          expect(dispatch).toHaveBeenCalledWith(increaseCountAction());
          expect(dispatch).toHaveBeenCalledWith(setLastPopupTimestamp());
          expect(dispatch).toHaveBeenCalledWith(resetCountAction());
          expect(showOptIn).toHaveBeenCalledTimes(1);
        });

        it('should trigger opt in at the 3rd counter increase', async () => {
          setMockedConfig({
            [configType]: {
              value: 3,
            },
          });

          // 1st counter increase -> do not show opt in
          await callback(callbackParams);
          expect(dispatch).toHaveBeenCalledTimes(1);
          expect(showOptIn).not.toHaveBeenCalled();

          // 2nd counter increase -> do not show opt in
          await callback(callbackParams);
          expect(dispatch).toHaveBeenCalledTimes(2);
          expect(showOptIn).not.toHaveBeenCalled();

          // 3rd counter increase -> show opt in
          await callback(callbackParams);
          expect(dispatch).toHaveBeenCalledTimes(6);
          expect(showOptIn).toHaveBeenCalledTimes(1);
        });

        it('should not trigger opt in again till "minDaysBetweenOptIns" elapsed', async () => {
          const mockedTS = new Date('2024-01-31T12:00:00.000Z').getTime();
          const dateMock = jest.spyOn(Date, 'now').mockImplementation(() => mockedTS);

          setMockedConfig({
            [configType]: {
              value: 1,
            },
            minDaysBetweenOptIns: 1,
          });

          // 1st counter increase -> show opt in
          await callback(callbackParams);
          expect(showOptIn).toHaveBeenCalledTimes(1);

          // fast forward time by 1/2 day
          dateMock.mockImplementation(() => mockedTS + (1000 * 60 * 60 * 12));

          // 2nd counter increase -> do not show opt in again
          await callback(callbackParams);
          expect(showOptIn).toHaveBeenCalledTimes(1);

          // fast forward time by 1 day
          dateMock.mockImplementation(() => mockedTS + (1000 * 60 * 60 * 24));

          // 3rd counter increase -> show opt in again
          await callback(callbackParams);
          expect(showOptIn).toHaveBeenCalledTimes(2);
        });

        it('should not trigger opt in when max rejection count is reached', async () => {
          setMockedConfig({
            [configType]: {
              value: 1,
            },
            minDaysBetweenOptIns: 0,
            rejectionMaxCount: 2,
          });

          // 1st counter increase -> show opt in
          await callback(callbackParams);
          expect(showOptIn).toHaveBeenCalledTimes(1);
          // Increase rejection count via actual action, since triggering increaseRejectionCount$
          // steam is complicated
          dispatch(increaseRejectionCount());

          // 2nd counter increase -> show opt in
          await callback(callbackParams);
          expect(showOptIn).toHaveBeenCalledTimes(2);
          dispatch(increaseRejectionCount());

          // 3rd counter increase -> no opt in due to rejection count
          await callback(callbackParams);
          expect(showOptIn).toHaveBeenCalledTimes(2);
        });

        it('should not trigger opt in when max repeats are reached', async () => {
          setMockedConfig({
            [configType]: {
              value: 2,
              repeats: 2,
            },
            minDaysBetweenOptIns: 0,
            rejectionMaxCount: 4,
          });

          await callback(callbackParams);
          // 2nd counter increase -> show opt in
          await callback(callbackParams);
          expect(showOptIn).toHaveBeenCalledTimes(1);
          dispatch(increaseRejectionCount());

          await callback(callbackParams);
          // 4rth counter increase -> show opt in
          await callback(callbackParams);
          expect(showOptIn).toHaveBeenCalledTimes(2);
          dispatch(increaseRejectionCount());

          await callback(callbackParams);
          // 6th counter increase -> show opt in
          await callback(callbackParams);
          expect(showOptIn).toHaveBeenCalledTimes(3);
          dispatch(increaseRejectionCount());

          await callback(callbackParams);
          // 8th counter increase -> no opt in due to max repeats reached
          await callback(callbackParams);
          expect(showOptIn).toHaveBeenCalledTimes(3);
        });
      });
    }
  );
});
