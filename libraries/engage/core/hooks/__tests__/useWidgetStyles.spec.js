import { useWidgetStyles } from '../useWidgetStyles';
import { useWidgetConfig } from '../useWidgetConfig';

jest.mock('../useWidgetConfig', () => ({
  useWidgetConfig: jest.fn(),
}));

describe('engage > core > hooks', () => {
  describe('useWidgetStyles()', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should return an empty object if no styles property exists', () => {
      useWidgetConfig.mockReturnValueOnce({});
      const styles = useWidgetStyles();
      expect(styles).toEqual({});
    });

    it('should return an empty object if no styles exist', () => {
      useWidgetConfig.mockReturnValueOnce({ style: {} });
      const styles = useWidgetStyles();
      expect(styles).toEqual({});
    });

    it('should return all widget styles.', () => {
      useWidgetConfig.mockReturnValueOnce({
        styles: {
          color: '#ff0000',
          width: '100%',
        },
      });
      const styles = useWidgetStyles();
      expect(styles).toEqual({
        color: '#ff0000',
        width: '100%',
      });
    });

    it('should pass down its given params to the lower level helper function.', () => {
      useWidgetConfig.mockReturnValueOnce({});
      useWidgetStyles('widgetId', 3);
      expect(useWidgetConfig).toBeCalledWith('widgetId', 3);
      expect(useWidgetConfig).toBeCalledTimes(1);
    });
  });
});
