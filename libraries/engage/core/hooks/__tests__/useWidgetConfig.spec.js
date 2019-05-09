import { useContext } from 'react';
import { useWidgetConfig } from '../useWidgetConfig';
import { usePageSettings } from '../usePageSettings';
import { useSettings } from '../useSettings';

const WIDGET_ID = '@shopgate/test/TestWidget';

jest.mock('react', () => ({
  useContext: jest.fn(),
  createContext: jest.fn(),
}));

jest.mock('../useRoute', () => ({
  useRoute: jest.fn(() => ({ pattern: '/test' })),
}));

jest.mock('../usePageSettings', () => ({
  usePageSettings: jest.fn(),
}));

jest.mock('../useSettings', () => ({
  useSettings: jest.fn(),
}));

describe('engage > core > hooks', () => {
  describe('useWidgetConfig()', () => {
    it('should return an empty object if no settings', () => {
      useContext.mockReturnValueOnce({
        pages: [{
          pattern: '/test',
          widgets: [{ id: WIDGET_ID }],
        }],
      });
      usePageSettings.mockReturnValueOnce({});
      useSettings.mockReturnValueOnce({});
      const config = useWidgetConfig(WIDGET_ID);
      expect(config).toEqual({ settings: {} });
    });

    it('should return an object having global settings only', () => {
      useContext.mockReturnValueOnce({
        pages: [{
          pattern: '/test',
          widgets: [{ id: WIDGET_ID }],
        }],
      });
      usePageSettings.mockReturnValueOnce({});
      useSettings.mockReturnValueOnce({
        [WIDGET_ID]: {
          test: 'foo',
        },
      });
      const config = useWidgetConfig(WIDGET_ID);
      expect(config).toEqual({ settings: { test: 'foo' } });
    });

    it('should override global settings by page settings', () => {
      useContext.mockReturnValueOnce({
        pages: [{
          pattern: '/test',
          widgets: [{ id: WIDGET_ID }],
        }],
      });
      usePageSettings.mockReturnValueOnce({
        [WIDGET_ID]: {
          test: 'bar',
        },
      });
      useSettings.mockReturnValueOnce({
        [WIDGET_ID]: {
          test: 'foo',
        },
      });
      const config = useWidgetConfig(WIDGET_ID);
      expect(config).toEqual({ settings: { test: 'bar' } });
    });

    it('should override page and global by widget settings', () => {
      useContext.mockReturnValueOnce({
        pages: [{
          pattern: '/test',
          widgets: [{
            id: WIDGET_ID,
            settings: {
              test: 'fuzz',
            },
          }],
        }],
      });
      usePageSettings.mockReturnValueOnce({
        [WIDGET_ID]: {
          test: 'bar',
        },
      });
      useSettings.mockReturnValueOnce({
        [WIDGET_ID]: {
          test: 'foo',
        },
      });
      const config = useWidgetConfig(WIDGET_ID);
      expect(config).toEqual({ settings: { test: 'fuzz' } });
    });
  });
});
