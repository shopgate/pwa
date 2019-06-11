import { getThemeSettings } from '../../config/getThemeSettings';
import { useSettings } from '../useSettings';

jest.mock('../../config/getThemeSettings', () => ({
  getThemeSettings: jest.fn(),
}));

describe('engage > core > hooks', () => {
  describe('useSettings()', () => {
    it('should return an empty object if no settings', () => {
      getThemeSettings.mockReturnValueOnce({});
      const settings = useSettings();
      expect(settings).toEqual({});
    });

    it('should return an object containing language and currency.', () => {
      getThemeSettings.mockReturnValueOnce({
        currency: 'USD',
        language: 'en-US',
      });
      const settings = useSettings();
      expect(settings).toEqual({
        currency: 'USD',
        language: 'en-US',
      });
    });
  });
});
