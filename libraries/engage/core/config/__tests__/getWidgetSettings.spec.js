import { getWidgetSettings } from '../getWidgetSettings';
import { getPageSettings } from '../getPageSettings';
import { getWidgetConfig } from '../getWidgetConfig';

jest.mock('../getPageSettings', () => ({
  getPageSettings: jest.fn(),
}));

jest.mock('../getWidgetConfig', () => ({
  getWidgetConfig: jest.fn(),
}));

const pagePattern = '/requested/page';
const widgetId = 'testWidgetId';

describe('engage > core > config', () => {
  describe('getWidgetSettings()', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should return an empty object when no widget settings are available in any scope.', () => {
      getPageSettings.mockReturnValueOnce(undefined);
      getWidgetConfig.mockReturnValueOnce({});
      expect(getWidgetSettings(pagePattern, widgetId)).toEqual({});
    });

    it('should return all local settings if there is nothing to inherit from.', () => {
      getPageSettings.mockReturnValueOnce(undefined);
      getWidgetConfig.mockReturnValueOnce({
        id: widgetId,
        name: 'WidgetName',
        settings: {
          all: {
            widget: 'settings',
          },
        },
      });
      expect(getWidgetSettings(pagePattern, widgetId)).toEqual({
        all: {
          widget: 'settings',
        },
      });
    });

    it('should pass down the params to the lower level functions for filtered inheritance.', () => {
      getPageSettings.mockReturnValueOnce({});
      getWidgetConfig.mockReturnValueOnce({});
      getWidgetSettings(pagePattern, widgetId, 7);
      expect(getPageSettings).toBeCalledWith(pagePattern, widgetId);
      expect(getPageSettings).toBeCalledTimes(1);
      expect(getWidgetConfig).toBeCalledWith(pagePattern, widgetId, 7);
      expect(getWidgetConfig).toBeCalledTimes(1);
    });

    it('should inherit matching keys from page settings.', () => {
      // Return unpacked object, not containing the key anymore, because the match is guaranteed
      getPageSettings.mockReturnValueOnce({
        things: {
          to: {
            inherit: 'some inherited value',
          },
        },
      });
      getWidgetConfig.mockReturnValueOnce({});
      expect(getWidgetSettings(pagePattern, widgetId)).toEqual({
        things: {
          to: {
            inherit: 'some inherited value',
          },
        },
      });
    });

    it('should inherit and mix properties for keys matching page and widget settings.', () => {
      // Return unpacked object, not containing the key anymore, because the match is guaranteed
      getPageSettings.mockReturnValueOnce({
        things: {
          toMix: {
            inherit: 'some inherited value',
            keep: 'low priority',
          },
        },
      });
      getWidgetConfig.mockReturnValueOnce({
        settings: {
          things: {
            toMix: {
              keep: 'high priority',
              alsoKeep: 'non-conflicting',
            },
          },
          moreToKeep: 'keep full key',
        },
      });
      expect(getWidgetSettings(pagePattern, widgetId)).toEqual({
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
      getPageSettings.mockReturnValueOnce(undefined);
      getWidgetConfig.mockReturnValueOnce({
        settings: {
          things: {
            toMix: {
              keep: 'high priority',
              alsoKeep: 'non-conflicting',
            },
          },
          moreToKeep: 'keep full key',
        },
      });
      expect(getWidgetSettings(pagePattern, widgetId)).toEqual({
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
