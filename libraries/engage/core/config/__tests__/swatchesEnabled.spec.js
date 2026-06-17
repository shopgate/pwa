import { swatchesEnabled } from '../swatchesEnabled';
import { getThemeSettings } from '../getThemeSettings';

jest.mock('../getThemeSettings', () => ({
  getThemeSettings: jest.fn(),
}));

describe('engage > core > config', () => {
  describe('swatchesEnabled()', () => {
    it('should return false when the swatches setting is not available.', () => {
      getThemeSettings.mockReturnValueOnce(undefined);
      expect(swatchesEnabled()).toBe(false);
    });

    it('should return false when swatches.enabled is not explicitly true.', () => {
      getThemeSettings.mockReturnValueOnce({ enabled: false });
      expect(swatchesEnabled()).toBe(false);
    });

    it('should return false when swatches.enabled is missing.', () => {
      getThemeSettings.mockReturnValueOnce({});
      expect(swatchesEnabled()).toBe(false);
    });

    it('should return true when swatches.enabled is true.', () => {
      getThemeSettings.mockReturnValueOnce({ enabled: true });
      expect(swatchesEnabled()).toBe(true);
    });
  });
});
