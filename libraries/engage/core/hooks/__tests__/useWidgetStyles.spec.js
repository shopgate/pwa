import { useWidgetStyles } from '../useWidgetStyles';
import { useWidgetConfig } from '../useWidgetConfig';
import { getThemeStyles } from '../../config/getThemeStyles';

jest.mock('../useWidgetConfig', () => ({
  useWidgetConfig: jest.fn(),
}));

jest.mock('../../config/getThemeStyles', () => ({
  getThemeStyles: jest.fn(),
}));

describe('engage > core > hooks', () => {
  describe('useWidgetStyles()', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should return an empty object if no styles property exists', () => {
      useWidgetConfig.mockReturnValueOnce({});
      getThemeStyles.mockReturnValueOnce({});
      const styles = useWidgetStyles();
      expect(styles).toEqual({});
    });

    it('should return an empty object if no styles exist', () => {
      useWidgetConfig.mockReturnValueOnce({ style: {} });
      getThemeStyles.mockReturnValueOnce({});
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
      getThemeStyles.mockReturnValueOnce({});

      const styles = useWidgetStyles();
      expect(styles).toEqual({
        color: '#ff0000',
        width: '100%',
      });
    });

    it('should return all theme styles.', () => {
      useWidgetConfig.mockReturnValueOnce({
        styles: {},
      });
      getThemeStyles.mockReturnValueOnce({
        color: '#ff0000',
        width: '100%',
      });

      const styles = useWidgetStyles();
      expect(styles).toEqual({
        color: '#ff0000',
        width: '100%',
      });
    });

    it('should return merged  widget/theme styles.', () => {
      useWidgetConfig.mockReturnValueOnce({
        styles: {
          color: '#666666',
          height: '100%',
        },
      });
      getThemeStyles.mockReturnValueOnce({
        color: '#ff0000',
        width: '100%',
      });

      const styles = useWidgetStyles();
      expect(styles).toEqual({
        color: '#666666',
        width: '100%',
        height: '100%',
      });
    });

    it('should pass down its given params to the lower level helper function.', () => {
      useWidgetConfig.mockReturnValueOnce({});
      getThemeStyles.mockReturnValueOnce({});

      useWidgetStyles('widgetId', 3);

      expect(useWidgetConfig).toBeCalledWith('widgetId', 3);
      expect(useWidgetConfig).toBeCalledTimes(1);
      expect(getThemeStyles).toBeCalledWith('widgetId');
      expect(getThemeStyles).toBeCalledTimes(1);
    });
  });
});
