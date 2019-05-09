import { useConfig } from '../useConfig';

jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  theme: {
    test: '1234',
    pages: [],
  },
}));

describe('engage > core > hooks', () => {
  describe('useConfig()', () => {
    it('should return the apropriate config.', () => {
      const config = useConfig();
      expect(config).toEqual({ test: '1234' });
    });
  });
});
