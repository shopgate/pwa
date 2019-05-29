import { useRoute } from '../useRoute';
import { usePageConfig } from '../usePageConfig';
import { useSettings } from '../useSettings';

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

jest.mock('../useSettings', () => ({
  useSettings: jest.fn(),
}));

describe('engage > core > hooks', () => {
  describe('usePageConfig()', () => {
    beforeEach(() => {
      jest.resetModules();
    });

    it('should return an empty object if no settings', () => {
      useRoute.mockReturnValueOnce({ pattern: '/test1' });
      useSettings.mockReturnValueOnce({});
      const config = usePageConfig();
      expect(config).toEqual({ settings: {} });
    });

    it('should return an object having global settings only', () => {
      useRoute.mockReturnValueOnce({ pattern: '/test2' });
      useSettings.mockReturnValueOnce({
        foo: 'bar',
      });
      const config = usePageConfig();
      expect(config).toEqual({ settings: { foo: 'bar' } });
    });

    it('should override page and global by widget settings', () => {
      useRoute.mockReturnValueOnce({ pattern: '/test3' });
      useSettings.mockReturnValueOnce({
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
