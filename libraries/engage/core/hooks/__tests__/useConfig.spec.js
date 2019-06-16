import { getThemeConfig } from '../../config/getThemeConfig';
import { useConfig } from '../useConfig';

jest.mock('../../config/getThemeConfig', () => ({
  getThemeConfig: jest.fn(),
}));

describe('engage > core > hooks', () => {
  describe('useConfig()', () => {
    it('should return the apropriate config.', () => {
      getThemeConfig.mockReturnValueOnce({
        test: '1234',
      });
      const config = useConfig();
      expect(config).toEqual({ test: '1234' });
    });
  });
});
