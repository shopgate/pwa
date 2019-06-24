import { useWidgetConfig } from '../useWidgetConfig';
import { usePageSettings } from '../usePageSettings';
import { getThemeSettings } from '../../config/getThemeSettings';
import { useRoute } from '../useRoute';

const WIDGET_ID = '@shopgate/test/TestWidget';

jest.mock('react', () => ({
  createContext: jest.fn(),
}));

jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  themeConfig: {
    pages: [
      {
        pattern: '/test1',
        widgets: [{ id: '@shopgate/test/TestWidget' }],
      },
      {
        pattern: '/test2',
        widgets: [{ id: '@shopgate/test/TestWidget' }],
      },
      {
        pattern: '/test3',
        widgets: [{ id: '@shopgate/test/TestWidget' }],
      },
      {
        pattern: '/test4',
        widgets: [{
          id: '@shopgate/test/TestWidget',
          settings: {
            test: 'fuzz',
          },
        },
        {
          // Same widget id as before, but index is "1" this time and has different settings
          id: '@shopgate/test/TestWidget',
          settings: {
            test: 'not fuzz',
          },
        }],
      },
    ],
  },
}));

jest.mock('../useRoute', () => ({
  useRoute: jest.fn(() => ({ pattern: '/test' })),
}));

jest.mock('../usePageSettings', () => ({
  usePageSettings: jest.fn(),
}));

jest.mock('../../config/getThemeSettings', () => ({
  getThemeSettings: jest.fn(),
}));

describe('engage > core > hooks', () => {
  describe('useWidgetConfig()', () => {
    it('should return an empty object if no settings', () => {
      useRoute.mockReturnValueOnce({ pattern: '/test1' });
      usePageSettings.mockReturnValueOnce({});
      getThemeSettings.mockReturnValueOnce({});
      const config = useWidgetConfig('@shopgate/test/TestWidget');
      expect(config).toEqual({ settings: {} });
    });

    it('should return an object having global settings only', () => {
      useRoute.mockReturnValueOnce({ pattern: '/test2' });
      usePageSettings.mockReturnValueOnce({});
      getThemeSettings.mockReturnValueOnce({
        [WIDGET_ID]: {
          test: 'foo',
        },
      });
      const config = useWidgetConfig('@shopgate/test/TestWidget');
      expect(config).toEqual({ settings: { test: 'foo' } });
    });

    it('should override global settings by page settings', () => {
      useRoute.mockReturnValueOnce({ pattern: '/test3' });
      usePageSettings.mockReturnValueOnce({
        '@shopgate/test/TestWidget': {
          test: 'bar',
        },
      });
      getThemeSettings.mockReturnValueOnce({
        '@shopgate/test/TestWidget': {
          test: 'foo',
        },
      });
      const config = useWidgetConfig('@shopgate/test/TestWidget');
      expect(config).toEqual({ settings: { test: 'bar' } });
    });

    it('should override page and global by settings of the first matching widget without index', () => {
      useRoute.mockReturnValueOnce({ pattern: '/test4' });
      usePageSettings.mockReturnValueOnce({
        [WIDGET_ID]: {
          test: 'bar',
        },
      });
      getThemeSettings.mockReturnValueOnce({
        [WIDGET_ID]: {
          test: 'foo',
        },
      });
      const config = useWidgetConfig(WIDGET_ID);
      expect(config).toEqual({ settings: { test: 'fuzz' } });
    });

    it('should override page and global by widget settings at index 1', () => {
      useRoute.mockReturnValueOnce({ pattern: '/test4' });
      usePageSettings.mockReturnValueOnce({
        [WIDGET_ID]: {
          test: 'bar',
        },
      });
      getThemeSettings.mockReturnValueOnce({
        [WIDGET_ID]: {
          test: 'foo',
        },
      });
      const config = useWidgetConfig(WIDGET_ID, 1);
      expect(config).toEqual({ settings: { test: 'not fuzz' } });
    });
  });
});
