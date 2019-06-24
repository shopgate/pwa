import { useRoute } from '../useRoute';
import { usePageConfig } from '../usePageConfig';
import { getThemeSettings } from '../../config/getThemeSettings';

jest.mock('react', () => ({
  createContext: jest.fn(),
}));

jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  themeConfig: {
    pages: [
      {
        pattern: '/test1',
      },
      {
        pattern: '/test2',
      },
      {
        pattern: '/test3',
        settings: {
          foo: 'fuzz',
          test: true,
        },
      },
    ],
  },
}));

jest.mock('../useRoute', () => ({
  useRoute: jest.fn(() => ({ pattern: '/test' })),
}));

jest.mock('../../config/getThemeSettings', () => ({
  getThemeSettings: jest.fn(),
}));

describe('engage > core > hooks', () => {
  describe('usePageConfig()', () => {
    beforeEach(() => {
      jest.resetModules();
    });

    it('should return an empty object if no settings', () => {
      useRoute.mockReturnValueOnce({ pattern: '/test1' });
      getThemeSettings.mockReturnValueOnce({});
      const config = usePageConfig();
      expect(config).toEqual({ settings: {} });
    });

    it('should return an object having global settings only', () => {
      useRoute.mockReturnValueOnce({ pattern: '/test2' });
      getThemeSettings.mockReturnValueOnce({
        foo: 'bar',
      });
      const config = usePageConfig();
      expect(config).toEqual({ settings: { foo: 'bar' } });
    });

    it('should override page and global by widget settings', () => {
      useRoute.mockReturnValueOnce({ pattern: '/test3' });
      getThemeSettings.mockReturnValueOnce({
        foo: 'bar',
      });
      const config = usePageConfig();
      expect(config).toEqual({
        settings: {
          foo: 'fuzz',
          test: true,
        },
      });
    });
  });
});
