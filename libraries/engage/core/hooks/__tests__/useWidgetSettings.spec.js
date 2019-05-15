import { useWidgetSettings } from '../useWidgetSettings';
import { useWidgetConfig } from '../useWidgetConfig';

jest.mock('../useWidgetConfig', () => ({
  useWidgetConfig: jest.fn(),
}));

describe('engage > core > hooks', () => {
  describe('useWidgetSettings()', () => {
    it('should return an empty object if no settings', () => {
      useWidgetConfig.mockReturnValueOnce({});
      const settings = useWidgetSettings();
      expect(settings).toEqual({});
    });

    it('should return an object containing language and currency.', () => {
      useWidgetConfig.mockReturnValueOnce({
        settings: {
          showPrice: true,
        },
      });
      const settings = useWidgetSettings();
      expect(settings).toEqual({
        showPrice: true,
      });
    });
  });
});
