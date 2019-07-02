import { useWidgetSettings } from '../useWidgetSettings';
import { useRoute } from '../useRoute';
import { getWidgetSettings } from '../../config/getWidgetSettings';

jest.mock('../useRoute', () => ({
  useRoute: jest.fn(),
}));

jest.mock('../../config/getWidgetSettings', () => ({
  getWidgetSettings: jest.fn(),
}));

describe('engage > core > hooks', () => {
  describe('useWidgetSettings()', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should pass down its given params and the page pattern to the lower level helper functions.', () => {
      useRoute.mockReturnValue({ pattern: '/test' });
      useWidgetSettings('widgetId', 3);
      expect(getWidgetSettings).toBeCalledWith('/test', 'widgetId', 3);
      expect(getWidgetSettings).toBeCalledTimes(1);
      expect(useRoute).toBeCalledTimes(1);
    });

    it('should return what it got from the helper function without messing with references.', () => {
      useRoute.mockReturnValue({ pattern: '/test' });
      const testWidgetSettings = { custom: 'setting' };
      getWidgetSettings.mockReturnValue(testWidgetSettings);
      const result = useWidgetSettings('widgetId', 3);
      expect(result === testWidgetSettings).toBeTruthy();
    });
  });
});
