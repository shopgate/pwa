import { useWidgetStyles } from '../useWidgetStyles';
import { useWidgetConfig } from '../useWidgetConfig';

jest.mock('../useWidgetConfig', () => ({
  useWidgetConfig: jest.fn(),
}));

describe('engage > core > hooks', () => {
  describe('useWidgetStyles()', () => {
    it('should return an empty object if no settings', () => {
      useWidgetConfig.mockReturnValueOnce({});
      const styles = useWidgetStyles();
      expect(styles).toEqual({});
    });

    it('should return an object containing language and currency.', () => {
      useWidgetConfig.mockReturnValueOnce({
        styles: {
          color: '#ff0000',
        },
      });
      const styles = useWidgetStyles();
      expect(styles).toEqual({
        color: '#ff0000',
      });
    });
  });
});
