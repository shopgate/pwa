import { SCANNER_MIN_APP_LIB_VERSION } from '@shopgate/pwa-core/classes/Scanner';
import {
  getClientInformation,
  hasScannerSupport,
  getDeviceInformation,
  getPlatform,
  getDeviceModel,
  isAndroid,
  isIos,
  getPageInsets,
} from './client';

import {
  OS_ANDROID,
  OS_IOS,
  MODEL_NAMES_IPHONE_X,
  PAGE_INSETS_ANDROID,
  PAGE_INSETS_IOS,
  PAGE_INSETS_IPHONE_X,
} from '../constants/Device';

let mockedHasSGJavaScriptBridge;
jest.mock('@shopgate/pwa-core/helpers', () => ({
  hasSGJavaScriptBridge: (...args) => mockedHasSGJavaScriptBridge(...args),
}));

const mockedStateAndroid = {
  client: {
    isFetching: false,
    device: {
      model: 'Samsung Galaxy S9',
      type: 'phone',
      os: {
        platform: 'android',
        ver: '9.0',
      },
    },
  },
};

const mockedStateIPhoneX = {
  client: {
    isFetching: false,
    device: {
      model: MODEL_NAMES_IPHONE_X[0],
      type: 'phone',
      os: {
        platform: 'ios',
        ver: '11.0',
      },
    },
  },
};

describe('Client selectors', () => {
  describe('getClientInformation()', () => {
    it('should return an empty object if the client state is not ready yet', () => {
      const result = getClientInformation({ client: {} });
      expect(result).toEqual({});
    });

    it('should return the expected state', () => {
      const result = getClientInformation({ ...mockedStateAndroid });
      expect(result).toEqual(mockedStateAndroid.client);
    });
  });

  describe('hasScannerSupport()', () => {
    it('should return true when the app supports the scanner', () => {
      const result = hasScannerSupport({ client: { libVersion: SCANNER_MIN_APP_LIB_VERSION } });
      expect(result).toBeTruthy();
    });

    it('should return false when the app does not support the scanner', () => {
      const result = hasScannerSupport({ client: { libVersion: '17.0' } });
      expect(result).toBeFalsy();
    });

    it('should return false when the app lib version is unknown', () => {
      const result = hasScannerSupport({ client: {} });
      expect(result).toBeFalsy();
    });
  });

  describe('getDeviceInformation()', () => {
    it('should return null if the client state is not ready yet', () => {
      const result = getDeviceInformation({ client: {} });
      expect(result).toBeNull();
    });

    it('should return null if the client state does not contain the requested data', () => {
      const state = {
        ...mockedStateAndroid,
        client: {
          ...mockedStateAndroid.client,
          device: undefined,
        },
      };
      const result = getDeviceInformation(state);

      expect(result).toBeNull();
    });

    it('should return the expected state', () => {
      const result = getDeviceInformation({ ...mockedStateAndroid });
      expect(result).toEqual(mockedStateAndroid.client.device);
    });
  });

  describe('getPlatform()', () => {
    it('should return null if the client state is not ready yet', () => {
      const result = getPlatform({ client: {} });
      expect(result).toBeNull();
    });

    it('should return Android as platform', () => {
      const result = getPlatform({ ...mockedStateAndroid });
      expect(result).toEqual(OS_ANDROID);
    });

    it('should return iOS as platform', () => {
      const result = getPlatform({ ...mockedStateIPhoneX });
      expect(result).toEqual(OS_IOS);
    });
  });

  describe('getDeviceModel()', () => {
    it('should return null if the client state is not ready yet', () => {
      const result = getDeviceModel({ client: {} });
      expect(result).toBeNull();
    });

    it('should return the correct device model', () => {
      const result = getDeviceModel({ ...mockedStateIPhoneX });
      expect(result).toEqual(MODEL_NAMES_IPHONE_X[0]);
    });
  });

  describe('isAndroid()', () => {
    it('should return false if the client state is not ready yet', () => {
      const result = isAndroid({ client: {} });
      expect(result).toBe(false);
    });

    it('should return false on iOS devices', () => {
      const result = isAndroid({ ...mockedStateIPhoneX });
      expect(result).toBe(false);
    });

    it('should return true on Android devices', () => {
      const result = isAndroid({ ...mockedStateAndroid });
      expect(result).toBe(true);
    });
  });

  describe('isIos()', () => {
    it('should return false if the client state is not ready yet', () => {
      const result = isIos({ client: {} });
      expect(result).toBe(false);
    });

    it('should return false on Android devices', () => {
      const result = isIos({ ...mockedStateAndroid });
      expect(result).toBe(false);
    });

    it('should return true on iOS devices', () => {
      const result = isIos({ ...mockedStateIPhoneX });
      expect(result).toBe(true);
    });
  });

  describe('getPageInsets()', () => {
    beforeEach(() => {
      mockedHasSGJavaScriptBridge = jest.fn(() => true);
    });

    it('should return the Android insets if the client state is not ready yet', () => {
      const result = getPageInsets({ client: {} });
      expect(result).toEqual(PAGE_INSETS_ANDROID);
    });

    it('should return the Android insets on Android devices', () => {
      const result = getPageInsets({ ...mockedStateAndroid });
      expect(result).toEqual(PAGE_INSETS_ANDROID);
    });

    it('should return the Android insets when no SGJavaScriptBridge is available', () => {
      mockedHasSGJavaScriptBridge = jest.fn(() => false);
      const result = getPageInsets({ ...mockedStateAndroid });
      expect(result).toEqual(PAGE_INSETS_ANDROID);
    });

    it('should return the default iOS insets on iOS devices', () => {
      const state = {
        ...mockedStateIPhoneX,
        client: {
          ...mockedStateIPhoneX.client,
          device: {
            ...mockedStateIPhoneX.client.device,
            model: 'iPhone8,1',
          },
        },
      };

      const result = getPageInsets(state);
      expect(result).toEqual(PAGE_INSETS_IOS);
    });

    it('should return the iPhone X insets on an iPhone X', () => {
      const result = getPageInsets({ ...mockedStateIPhoneX });
      expect(result).toEqual(PAGE_INSETS_IPHONE_X);
    });
  });
});
