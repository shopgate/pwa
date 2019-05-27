import { useRoute } from '../useRoute';
import { usePageConfig } from '../usePageConfig';
import { useSettings } from '../useSettings';

const WIDGET_ID = '@shopgate/test/TestWidget';

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
        // widget specific page settings
        pattern: '/test3',
        settings: {
          '@shopgate/test/TestWidget': {
            foo: 'fuzz',
            test: true,
          },
        },
      },
      {
        // page settings
        pattern: '/test4',
        settings: {
          foo: 'fuzz',
          test4: true,
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
      jest.resetAllMocks();
    });

    it('should return an empty object if no page settings set', () => {
      useRoute.mockReturnValueOnce({ pattern: '/test1' });
      useSettings.mockReturnValueOnce({});
      const config = usePageConfig();
      expect(config).toEqual({});
    });

    it('xshould return widget specific global settings if no page widget settings available', () => {
      useRoute.mockReturnValueOnce({ pattern: '/test1' });
      useSettings.mockReturnValueOnce({
        [WIDGET_ID]: {
          foo: 'bar',
        },
      });
      const config = usePageConfig(WIDGET_ID);
      expect(config).toEqual({ settings: { foo: 'bar' } });
    });

    it('should return an empty object if only unscoped global settings available', () => {
      useRoute.mockReturnValueOnce({ pattern: '/test2' });
      useSettings.mockReturnValueOnce({
        foo: 'bar',
      });
      const config = usePageConfig();
      expect(config).toEqual({});
    });

    it('should skip unscoped page settings when asked for settings by widget id', () => {
      useRoute.mockReturnValueOnce({ pattern: '/test4' });
      // Provide scoped global settings
      useSettings.mockReturnValueOnce({
        [WIDGET_ID]: {
          foo: 'bar',
          foo2: 'bar2',
        },
      });
      const config = usePageConfig(WIDGET_ID);
      expect(config).toEqual({
        settings: {
          foo: 'bar',
          foo2: 'bar2',
        },
      });
    });

    it('should merge scoped page and global settings when asked for settings by widget id', () => {
      useRoute.mockReturnValueOnce({ pattern: '/test3' });
      // Provide scoped global settings
      useSettings.mockReturnValueOnce({
        [WIDGET_ID]: {
          foo: 'bar',
          foo2: 'bar2',
        },
      });
      const config = usePageConfig(WIDGET_ID);
      expect(config).toEqual({
        settings: {
          foo: 'fuzz',
          foo2: 'bar2',
          test: true,
        },
      });
    });
  });
});
