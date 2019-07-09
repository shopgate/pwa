import { getThemeSettings } from '../getThemeSettings';
import { getThemeConfig } from '../getThemeConfig';

jest.mock('../getThemeConfig', () => ({
  getThemeConfig: jest.fn(),
}));

describe('engage > core > config', () => {
  describe('getThemeSettings()', () => {
    it('should return an empty object if no settings are available without using a key.', () => {
      getThemeConfig.mockReturnValueOnce({});
      const settings = getThemeSettings();
      expect(settings).toEqual({});
    });

    it('should return all theme settings when no key is passed.', () => {
      getThemeConfig.mockReturnValueOnce({
        settings: {
          currency: 'USD',
          language: 'en-US',
        },
      });
      const settings = getThemeSettings();
      expect(settings).toEqual({
        currency: 'USD',
        language: 'en-US',
      });
    });

    it('should return only a single theme settings entry, matching the given key.', () => {
      getThemeConfig.mockReturnValueOnce({
        settings: {
          currency: 'USD',
          language: 'en-US',
        },
      });
      const settings = getThemeSettings('currency');
      expect(settings).toEqual('USD');
    });

    it('should return undefined if the requested settings key does not exist.', () => {
      getThemeConfig.mockReturnValueOnce({
        settings: {
          currency: 'USD',
          language: 'en-US',
        },
      });
      const settings = getThemeSettings('other');
      expect(settings).toBeUndefined();
    });
  });
});
