import { getThemeStyles } from '../getThemeStyles';
import { getThemeConfig } from '../getThemeConfig';

jest.mock('../getThemeConfig', () => ({
  getThemeConfig: jest.fn(),
}));

describe('engage > core > config', () => {
  describe('getThemeStyles()', () => {
    it('should return an empty object if no styles property exists', () => {
      getThemeConfig.mockReturnValueOnce({});
      const styles = getThemeStyles();
      expect(styles).toEqual({});
    });

    it('should return all styles if no key is given', () => {
      const mockStyles = {
        '@shopgate/engage/product/ProductGrid': {
          color: 'red',
        },
        '@shopgate/engage/product/ProductSlider': {
          color: 'blue',
        },
      };
      getThemeConfig.mockReturnValueOnce({
        styles: mockStyles,
      });
      const styles = getThemeStyles();
      expect(styles).toEqual(mockStyles);
    });

    it('should return specific styles if key is given', () => {
      const mockStyles = {
        '@shopgate/engage/product/ProductGrid': {
          color: 'red',
        },
        '@shopgate/engage/product/ProductSlider': {
          color: 'blue',
        },
      };
      getThemeConfig.mockReturnValueOnce({
        styles: mockStyles,
      });
      const styles = getThemeStyles('@shopgate/engage/product/ProductSlider');
      expect(styles).toEqual({
        color: 'blue',
      });
    });

    it('should return undefined if key is no available', () => {
      getThemeConfig.mockReturnValueOnce({});
      const styles = getThemeStyles('keyNotAvailable');
      expect(styles).toBeUndefined();
    });
  });
});
