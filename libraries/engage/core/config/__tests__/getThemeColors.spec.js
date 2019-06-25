import { getThemeConfig } from '../getThemeConfig';
import { getThemeColors } from '../getThemeColors';

jest.mock('../getThemeConfig', () => ({
  getThemeConfig: jest.fn(),
}));

describe('engage > core > config', () => {
  describe('getThemeColors()', () => {
    it('should return an empty object if no colors are available without using a key.', () => {
      getThemeConfig.mockReturnValueOnce({});
      const colors = getThemeColors();
      expect(colors).toEqual({});
    });

    it('should return all theme colors when no key is passed.', () => {
      getThemeConfig.mockReturnValueOnce({
        colors: { primary: '#ff0000' },
      });
      const colors = getThemeColors();
      expect(colors).toEqual({ primary: '#ff0000' });
    });

    it('should return only a single theme color entry, matching the given key.', () => {
      getThemeConfig.mockReturnValueOnce({
        colors: {
          primary: '#ff0000',
          accent: '#47f',
        },
      });
      const colors = getThemeColors('accent');
      expect(colors).toEqual('#47f');
    });

    it('should return undefined if the requested color key does not exist.', () => {
      getThemeConfig.mockReturnValueOnce({
        colors: {
          primary: '#ff0000',
          accent: '#47f',
        },
      });
      const settings = getThemeColors('other');
      expect(settings).toBeUndefined();
    });
  });
});
