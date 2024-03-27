import { hasSGJavaScriptBridge } from '@shopgate/pwa-core/helpers';
import { APP_FEATURE_PUSH_OPT_IN } from '@shopgate/engage/core/constants';
import { appSupportsPushOptIn } from '../appFeatures';

jest.mock('@shopgate/pwa-core/helpers', () => ({
  hasSGJavaScriptBridge: jest.fn().mockReturnValue(true),
}));

describe('App Features', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('appSupportsPushOptIn()', () => {
    /**
     * Creates a mocked SGAppInfo object
     * @param {Object} value The value for the object
     */
    const createAppInfo = (value) => {
      Object.defineProperty(window, 'SGAppInfo', value);
    };

    beforeEach(() => {

    });

    it('should return true in development', () => {
      hasSGJavaScriptBridge.mockReturnValueOnce(false);

      expect(appSupportsPushOptIn()).toBe(true);
    });

    it('should return false when SGAppInfo object does not exist', () => {
      expect(appSupportsPushOptIn()).toBe(false);
    });

    it('should return false when SGAppInfo object does contain feature flags', () => {
      createAppInfo({
        moduleInfo: {
          Push: [1],
        },
      });
      expect(appSupportsPushOptIn()).toBe(false);
    });

    it('should return false when the push feature flags do not contain the optIn flag', () => {
      createAppInfo({
        featureFlags: {
          Push: {
            1: {
              flags: [],
            },
          },
        },
      });
      expect(appSupportsPushOptIn()).toBe(false);
    });

    it('should return true when the push feature flags contain the optIn flag', () => {
      createAppInfo({
        featureFlags: {
          Push: {
            1: {
              flags: [APP_FEATURE_PUSH_OPT_IN],
            },
          },
        },
      });
      expect(appSupportsPushOptIn()).toBe(false);
    });
  });
});
