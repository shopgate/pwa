import { isAppFeatureFlagEnabled } from './appFeatureFlags';

const appWindow: { SGAppInfo?: unknown } = window;

describe('isAppFeatureFlagEnabled()', () => {
  afterEach(() => {
    delete appWindow.SGAppInfo;
  });

  it('should return false without app info', () => {
    expect(isAppFeatureFlagEnabled('Push', 'optIn')).toBe(false);
  });

  it.each([
    ['without feature flags', {}],
    ['without the category', { featureFlags: { Analytics: { 1: { flags: ['optIn'] } } } }],
    ['without the version', { featureFlags: { Push: { 2: { flags: ['optIn'] } } } }],
    ['without flags', { featureFlags: { Push: { 1: {} } } }],
    ['with flags that are no list', { featureFlags: { Push: { 1: { flags: 'optIn' } } } }],
    ['without the flag', { featureFlags: { Push: { 1: { flags: ['other'] } } } }],
  ])('should return false %s', (_, appInfo) => {
    appWindow.SGAppInfo = appInfo;

    expect(isAppFeatureFlagEnabled('Push', 'optIn')).toBe(false);
  });

  it('should return true when the app reports the flag', () => {
    appWindow.SGAppInfo = { featureFlags: { Push: { 1: { flags: ['other', 'optIn'] } } } };

    expect(isAppFeatureFlagEnabled('Push', 'optIn')).toBe(true);
  });

  it('should look up the flag in the given version', () => {
    appWindow.SGAppInfo = {
      featureFlags: {
        Push: {
          1: { flags: [] },
          2: { flags: ['optIn'] },
        },
      },
    };

    expect(isAppFeatureFlagEnabled('Push', 'optIn', '2')).toBe(true);
    expect(isAppFeatureFlagEnabled('Push', 'optIn')).toBe(false);
  });
});
