import { SCANNER_MIN_APP_LIB_VERSION } from '@shopgate/pwa-core/constants/Scanner';
import {
  getClientInformation,
  getClientConnectivity,
  hasScannerSupport,
  getDeviceInformation,
  getPlatform,
  getDeviceModel,
  isAndroid,
  isIos,
  getPageInsets,
  getIsConnected,
  getClientConnectivityNetwork,
  getClientConnectivityType,
  makeGetSupportedIdentityServices,
  makeSupportsIdentityService,
} from './client';

import {
  OS_ANDROID,
  OS_IOS,
  MODEL_NAMES_IPHONE_X,
  PAGE_INSETS_ANDROID,
  PAGE_INSETS_IOS,
  PAGE_INSETS_IPHONE_X,
} from '../constants/Device';
import { CONNECTIVITY_TYPE_4G } from '../constants/client';

let mockedHasSGJavaScriptBridge;
jest.mock('@shopgate/pwa-core/helpers', () => ({
  hasSGJavaScriptBridge: () => mockedHasSGJavaScriptBridge(),
  logger: {
    error: jest.fn(),
  },
}));

describe('Client selectors', () => {
  describe('Client information', () => {
    const mockedStateAndroid = {
      isFetching: false,
      device: {
        model: 'Samsung Galaxy S9',
        type: 'phone',
        os: {
          platform: 'android',
          ver: '9.0',
        },
      },
    };

    const mockedStateIPhoneX = {
      isFetching: false,
      device: {
        model: MODEL_NAMES_IPHONE_X[0],
        type: 'phone',
        os: {
          platform: 'ios',
          ver: '11.0',
        },
      },
      supportedIdentityServices: ['apple', 'facebook'],
    };

    /**
     * Creates a mocked state.
     * @param {Object} state The sub-state of the client state.
     * @returns {Object}
     */
    const createMockState = state => ({
      client: {
        info: {
          ...state,
        },
      },
    });

    describe('getClientInformation()', () => {
      it('should return an empty object if the client state is not ready yet', () => {
        const result = getClientInformation(createMockState({}));
        expect(result).toEqual({});
      });

      it('should return the expected state', () => {
        const result = getClientInformation(createMockState(mockedStateAndroid));
        expect(result).toEqual(mockedStateAndroid);
      });
    });

    describe('hasScannerSupport()', () => {
      it('should return true when the app supports the scanner', () => {
        const result = hasScannerSupport(createMockState({
          libVersion: SCANNER_MIN_APP_LIB_VERSION,
        }));
        expect(result).toBeTruthy();
      });

      it('should return false when the app does not support the scanner', () => {
        const result = hasScannerSupport(createMockState({ libVersion: '17.0' }));
        expect(result).toBeFalsy();
      });

      it('should return false when the app lib version is unknown', () => {
        const result = hasScannerSupport(createMockState({}));
        expect(result).toBeFalsy();
      });
    });

    describe('getDeviceInformation()', () => {
      it('should return null if the client state is not ready yet', () => {
        const result = getDeviceInformation(createMockState({}));
        expect(result).toBeNull();
      });

      it('should return null if the client state does not contain the requested data', () => {
        const state = createMockState({
          ...mockedStateAndroid,
          device: undefined,
        });

        const result = getDeviceInformation(state);
        expect(result).toBeNull();
      });

      it('should return the expected state', () => {
        const result = getDeviceInformation(createMockState(mockedStateAndroid));
        expect(result).toEqual(mockedStateAndroid.device);
      });
    });

    describe('getPlatform()', () => {
      it('should return null if the client state is not ready yet', () => {
        const result = getPlatform(createMockState({}));
        expect(result).toBeNull();
      });

      it('should return Android as platform', () => {
        const result = getPlatform(createMockState(mockedStateAndroid));
        expect(result).toEqual(OS_ANDROID);
      });

      it('should return iOS as platform', () => {
        const result = getPlatform(createMockState(mockedStateIPhoneX));
        expect(result).toEqual(OS_IOS);
      });
    });

    describe('getDeviceModel()', () => {
      it('should return null if the client state is not ready yet', () => {
        const result = getDeviceModel(createMockState({}));
        expect(result).toBeNull();
      });

      it('should return the correct device model', () => {
        const result = getDeviceModel(createMockState(mockedStateIPhoneX));
        expect(result).toEqual(MODEL_NAMES_IPHONE_X[0]);
      });
    });

    describe('isAndroid()', () => {
      it('should return false if the client state is not ready yet', () => {
        const result = isAndroid(createMockState({}));
        expect(result).toBe(false);
      });

      it('should return false on iOS devices', () => {
        const result = isAndroid(createMockState(mockedStateIPhoneX));
        expect(result).toBe(false);
      });

      it('should return true on Android devices', () => {
        const result = isAndroid(createMockState(mockedStateAndroid));
        expect(result).toBe(true);
      });
    });

    describe('isIos()', () => {
      it('should return false if the client state is not ready yet', () => {
        const result = isIos(createMockState({}));
        expect(result).toBe(false);
      });

      it('should return false on Android devices', () => {
        const result = isIos(createMockState(mockedStateAndroid));
        expect(result).toBe(false);
      });

      it('should return true on iOS devices', () => {
        const result = isIos(createMockState(mockedStateIPhoneX));
        expect(result).toBe(true);
      });
    });

    describe('getPageInsets()', () => {
      beforeEach(() => {
        mockedHasSGJavaScriptBridge = jest.fn(() => true);
      });

      it('should return the Android insets if the client state is not ready yet', () => {
        const result = getPageInsets(createMockState({}));
        expect(result).toEqual(PAGE_INSETS_ANDROID);
      });

      it('should return the Android insets on Android devices', () => {
        const result = getPageInsets(createMockState(mockedStateAndroid));
        expect(result).toEqual(PAGE_INSETS_ANDROID);
      });

      it('should return the Android insets when no SGJavaScriptBridge is available', () => {
        mockedHasSGJavaScriptBridge = jest.fn(() => false);
        const result = getPageInsets(createMockState(mockedStateAndroid));
        expect(result).toEqual(PAGE_INSETS_ANDROID);
      });

      it('should return the default iOS insets on iOS devices', () => {
        const state = createMockState({
          ...mockedStateIPhoneX,
          device: {
            ...mockedStateIPhoneX.device,
            model: 'iPhone8,1',
          },
        });

        const result = getPageInsets(state);
        expect(result).toEqual(PAGE_INSETS_IOS);
      });

      it('should return the iPhone X insets on an iPhone X', () => {
        const result = getPageInsets(createMockState(mockedStateIPhoneX));
        expect(result).toEqual(PAGE_INSETS_IPHONE_X);
      });
    });

    describe('supportedIdentityServices()', () => {
      it('should return identity services', () => {
        const selector = makeGetSupportedIdentityServices();
        const result = selector(createMockState(mockedStateIPhoneX));
        expect(result).toEqual(mockedStateIPhoneX.supportedIdentityServices);
      });
      it('should support identity service apple', () => {
        const selector = makeSupportsIdentityService('apple');
        const result = selector(createMockState(mockedStateIPhoneX));
        expect(result).toEqual(true);
      });
    });
  });

  describe('Client connectivity', () => {
    /**
     * Creates a mocked state.
     * @param {Object} state The sub-state of the client state.
     * @returns {Object}
     */
    const createMockState = state => ({
      client: {
        connectivity: {
          ...state,
        },
      },
    });
    const mockedNetwork = CONNECTIVITY_TYPE_4G;
    const mockedType = 'LTE';
    const mockedState = {
      connected: true,
      network: mockedNetwork,
      type: mockedType,
    };

    describe('getClientConnectivity()', () => {
      it('should return an empty object if the client state is not ready yet', () => {
        const result = getClientConnectivity(createMockState({}));
        expect(result).toEqual({});
      });

      it('should return the expected state', () => {
        const result = getClientConnectivity(createMockState(mockedState));
        expect(result).toEqual(mockedState);
      });
    });

    describe('getIsConnected()', () => {
      it('should return TRUE', () => {
        const result = getIsConnected(createMockState(mockedState));
        expect(result).toBe(true);
      });
    });

    describe('getClientConnectivityNetwork()', () => {
      it('should return 4G', () => {
        const result = getClientConnectivityNetwork(createMockState(mockedState));
        expect(result).toBe(mockedNetwork);
      });
    });

    describe('getClientConnectivityType()', () => {
      it('should return LTE', () => {
        const result = getClientConnectivityType(createMockState(mockedState));
        expect(result).toBe(mockedType);
      });
    });
  });
});
