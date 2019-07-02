import { getWidgetConfig } from '../getWidgetConfig';
import { getPageConfig } from '../getPageConfig';

jest.mock('../getPageConfig', () => ({
  getPageConfig: jest.fn(),
}));

const pagePattern = '/requested/page';
const widgetId = 'testWidgetId';

describe('engage > core > config', () => {
  describe('getWidgetConfig()', () => {
    it('should return an empty object if no widgets are defined on the page.', () => {
      getPageConfig.mockReturnValueOnce({});
      const result = getWidgetConfig(pagePattern, widgetId);
      expect(result).toEqual({});
    });

    it('should return an empty object if the widget is not found.', () => {
      getPageConfig.mockReturnValueOnce({ widgets: [] });
      expect(getWidgetConfig(pagePattern)).toEqual({});
    });

    it('should only return the first widget, which matches the given widgetId.', () => {
      getPageConfig.mockReturnValueOnce({
        widgets: [{
          id: '/some/other/page',
          name: 'Other Widget',
        }, {
          id: widgetId,
          name: 'Correct Widget Id And First Found',
        }, {
          id: widgetId,
          name: 'Correct Widget Id But Not First',
        }, {
          id: '/yet/another/widgetid',
          name: 'Yet Another Widget',
        }],
      });
      expect(getWidgetConfig(pagePattern, widgetId)).toEqual({
        id: widgetId,
        name: 'Correct Widget Id And First Found',
      });
    });

    it('should only return the correct widget, which matches the given widgetId and given index.', () => {
      getPageConfig.mockReturnValueOnce({
        widgets: [{
          id: '/some/other/page',
          name: 'Other Widget',
        }, {
          id: widgetId,
          name: 'Correct Widget Id Wrong Index',
        }, {
          id: widgetId,
          name: 'Correct Widget Id And Index',
        }, {
          id: widgetId,
          name: 'Correct Widget Id Too High Index',
        }, {
          id: '/yet/another/widgetid',
          name: 'Yet Another Widget',
        }],
      });
      expect(getWidgetConfig(pagePattern, widgetId, 2)).toEqual({
        id: widgetId,
        name: 'Correct Widget Id And Index',
      });
    });
  });
});
