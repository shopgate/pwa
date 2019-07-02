import { getPageSettings } from '../getPageSettings';
import { getThemeSettings } from '../getThemeSettings';
import { getPageConfig } from '../getPageConfig';

jest.mock('../getThemeSettings', () => ({
  getThemeSettings: jest.fn(),
}));

jest.mock('../getPageConfig', () => ({
  getPageConfig: jest.fn(),
}));

const requestedPagePattern = '/requested/page';

describe('engage > core > config', () => {
  describe('getPageConfig()', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should return an empty object when no page settings are available and no key set.', () => {
      getThemeSettings.mockReturnValueOnce(undefined);
      getPageConfig.mockReturnValueOnce({});
      expect(getPageSettings(requestedPagePattern)).toEqual({});
    });

    it('should return all settings of the given page without inheriting from higher scope.', () => {
      getThemeSettings.mockReturnValueOnce({
        higher: {
          scope: 'settings',
        },
      });
      getPageConfig.mockReturnValueOnce({
        pattern: requestedPagePattern,
        name: 'PageName',
        settings: {
          all: {
            page: 'settings',
          },
        },
      });
      expect(getPageSettings(requestedPagePattern)).toEqual({
        all: {
          page: 'settings',
        },
      });
    });

    it('should pass down the key to the lower level functions for filtered inheritance.', () => {
      const matchingKey = 'someKey';
      getThemeSettings.mockReturnValueOnce({});
      getPageConfig.mockReturnValueOnce({});
      getPageSettings(requestedPagePattern, matchingKey);
      expect(getThemeSettings).toBeCalledWith(matchingKey);
      expect(getThemeSettings).toBeCalledTimes(1);
    });

    it('should return undefined when the given key does not exist in any scope of settings.', () => {
      getThemeSettings.mockReturnValueOnce(undefined);
      getPageConfig.mockReturnValueOnce({});
      expect(getPageSettings(requestedPagePattern, 'nonExistentKey')).toBeUndefined();
      getThemeSettings.mockReturnValueOnce(undefined);
      getPageConfig.mockReturnValueOnce({ settings: { someOtherKey: 'someOtherValue' } });
      expect(getPageSettings(requestedPagePattern, 'nonExistentKey')).toBeUndefined();
    });

    it('should inherit matching keys from theme settings.', () => {
      // Return unpacked object, not containing the key anymore, because the match is guaranteed
      getThemeSettings.mockReturnValueOnce({
        things: {
          to: {
            inherit: 'some inherited value',
          },
        },
      });
      getPageConfig.mockReturnValueOnce({});
      expect(getPageSettings(requestedPagePattern, 'matchingKey')).toEqual({
        things: {
          to: {
            inherit: 'some inherited value',
          },
        },
      });
    });

    it('should inherit and mix properties for keys matching theme and page settings.', () => {
      const matchingKey = 'someKey';
      getThemeSettings.mockReturnValueOnce({
        things: {
          toMix: {
            inherit: 'some inherited value',
            keep: 'low priority',
          },
        },
      });
      getPageConfig.mockReturnValueOnce({
        settings: {
          [matchingKey]: {
            things: {
              toMix: {
                keep: 'high priority',
                alsoKeep: 'non-conflicting',
              },
            },
            moreToKeep: 'keep full key',
          },
          nonMatchingKey: {
            ignore: 'this',
          },
        },
      });
      expect(getPageSettings(requestedPagePattern, matchingKey)).toEqual({
        things: {
          toMix: {
            keep: 'high priority',
            alsoKeep: 'non-conflicting',
            inherit: 'some inherited value',
          },
        },
        moreToKeep: 'keep full key',
      });
    });

    it('should not fail when there is nothing to inherit from.', () => {
      const matchingKey = 'someKey';
      getThemeSettings.mockReturnValueOnce(undefined);
      getPageConfig.mockReturnValueOnce({
        settings: {
          [matchingKey]: {
            things: {
              toMix: {
                keep: 'high priority',
                alsoKeep: 'non-conflicting',
              },
            },
            moreToKeep: 'keep full key',
          },
          nonMatchingKey: {
            ignore: 'this',
          },
        },
      });
      expect(getPageSettings(requestedPagePattern, matchingKey)).toEqual({
        things: {
          toMix: {
            keep: 'high priority',
            alsoKeep: 'non-conflicting',
          },
        },
        moreToKeep: 'keep full key',
      });
    });
  });
});
