import { hasSGJavaScriptBridge } from '@shopgate/pwa-core/helpers';
import { APP_FEATURE_BIOMETRIC_LOGIN } from '@shopgate/engage/core/constants';
import { appSupportsBiometricLogin } from '../appFeatures';

jest.mock('@shopgate/pwa-core/helpers', () => ({
  hasSGJavaScriptBridge: jest.fn().mockReturnValue(true),
}));

describe('appSupportsBiometricLogin()', () => {
  afterEach(() => {
    delete window.SGAppInfo;
  });

  it('should return false outside of the app', () => {
    hasSGJavaScriptBridge.mockReturnValueOnce(false);
    window.SGAppInfo = {
      featureFlags: { Keychain: { 1: { flags: [APP_FEATURE_BIOMETRIC_LOGIN] } } },
    };

    expect(appSupportsBiometricLogin()).toBe(false);
  });

  it('should return false when the app does not provide feature flags', () => {
    expect(appSupportsBiometricLogin()).toBe(false);
  });

  it('should return false when the app does not provide the feature flag', () => {
    window.SGAppInfo = { featureFlags: { Keychain: { 1: { flags: [] } } } };

    expect(appSupportsBiometricLogin()).toBe(false);
  });

  it('should return true when the app provides the feature flag', () => {
    window.SGAppInfo = {
      featureFlags: { Keychain: { 1: { flags: [APP_FEATURE_BIOMETRIC_LOGIN] } } },
    };

    expect(appSupportsBiometricLogin()).toBe(true);
  });
});
