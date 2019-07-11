import { useWidgetConfig } from '../useWidgetConfig';
import { useRoute } from '../useRoute';
import { getWidgetConfig } from '../../config/getWidgetConfig';

jest.mock('../useRoute', () => ({
  useRoute: jest.fn(),
}));

jest.mock('../../config/getWidgetConfig', () => ({
  getWidgetConfig: jest.fn(),
}));

describe('engage > core > hooks', () => {
  describe('useWidgetConfig()', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should pass down its given params and the page pattern to the lower level helper functions.', () => {
      useRoute.mockReturnValue({ pattern: '/test' });
      useWidgetConfig('widgetId', 3);
      expect(getWidgetConfig).toBeCalledWith('/test', 'widgetId', 3);
      expect(getWidgetConfig).toBeCalledTimes(1);
      expect(useRoute).toBeCalledTimes(1);
    });

    it('should return what it got from the helper function without messing with references.', () => {
      useRoute.mockReturnValue({ pattern: '/test' });
      const testWidgetConfig = {
        widgetId: 'some/widget/id',
        settings: { custom: 'config' },
      };
      getWidgetConfig.mockReturnValue(testWidgetConfig);
      const result = useWidgetConfig('widgetId', 3);
      expect(result === testWidgetConfig).toBeTruthy();
    });
  });
});
