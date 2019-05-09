import { useContext } from 'react';
import { usePageConfig } from '../usePageConfig';
import { useSettings } from '../useSettings';

const PATTERN = '/test';

jest.mock('react', () => ({
  useContext: jest.fn(),
  createContext: jest.fn(),
}));

jest.mock('../useRoute', () => ({
  useRoute: jest.fn(() => ({ pattern: '/test' })),
}));

jest.mock('../useSettings', () => ({
  useSettings: jest.fn(),
}));

describe('engage > core > hooks', () => {
  describe('usePageConfig()', () => {
    it('should return an empty object if no settings', () => {
      useContext.mockReturnValueOnce({
        pages: [{ pattern: PATTERN }],
      });
      useSettings.mockReturnValueOnce({});
      const config = usePageConfig();
      expect(config).toEqual({ settings: {} });
    });

    it('should return an object having global settings only', () => {
      useContext.mockReturnValueOnce({
        pages: [{ pattern: PATTERN }],
      });
      useSettings.mockReturnValueOnce({
        foo: 'bar',
      });
      const config = usePageConfig();
      expect(config).toEqual({ settings: { foo: 'bar' } });
    });

    it('should override page and global by widget settings', () => {
      useContext.mockReturnValueOnce({
        pages: [{
          pattern: PATTERN,
          settings: {
            foo: 'fuzz',
            test: true,
          },
        }],
      });
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
