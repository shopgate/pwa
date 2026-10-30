import { hasSGJavaScriptBridge } from '@shopgate/engage/core/helpers';
import { APP_FEATURE_IN_APP_BROWSER_COLORS } from '@shopgate/engage/core/constants';
import { appSupportsInAppBrowserColors } from '../appFeatures';

jest.mock('@shopgate/engage/core/helpers', () => ({
  hasSGJavaScriptBridge: jest.fn().mockReturnValue(true),
  hasWebBridge: jest.fn().mockReturnValue(false),
  hasNewServices: jest.fn().mockReturnValue(false),
  isAndroidOs: false,
}));

describe('appSupportsInAppBrowserColors()', () => {
  afterEach(() => {
    delete window.SGAppInfo;
  });

  it('should return false outside of the app', () => {
    hasSGJavaScriptBridge.mockReturnValueOnce(false);
    window.SGAppInfo = {
      featureFlags: { InAppBrowser: { 1: { flags: [APP_FEATURE_IN_APP_BROWSER_COLORS] } } },
    };

    expect(appSupportsInAppBrowserColors()).toBe(false);
  });

  it('should return false when the app does not provide the feature flag', () => {
    window.SGAppInfo = { featureFlags: { InAppBrowser: { 1: { flags: [] } } } };

    expect(appSupportsInAppBrowserColors()).toBe(false);
  });

  it('should return true when the app provides the feature flag', () => {
    window.SGAppInfo = {
      featureFlags: { InAppBrowser: { 1: { flags: [APP_FEATURE_IN_APP_BROWSER_COLORS] } } },
    };

    expect(appSupportsInAppBrowserColors()).toBe(true);
  });
});
