import { usePageConfig } from '../usePageConfig';
import { usePageSettings } from '../usePageSettings';
import { useSettings } from '../useSettings';

jest.mock('../usePageConfig', () => ({
  usePageConfig: jest.fn(),
}));

jest.mock('../useSettings', () => ({
  useSettings: jest.fn(),
}));

describe('engage > core > hooks', () => {
  describe('usePageSettings()', () => {
    it('should return an empty object if no settings', () => {
      usePageConfig.mockReturnValueOnce({});
      useSettings.mockReturnValueOnce({});
      const settings = usePageSettings();
      expect(settings).toEqual({});
    });

    it('should return an object containing language and currency.', () => {
      usePageConfig.mockReturnValueOnce({
        settings: {
          showVideos: true,
        },
      });
      useSettings.mockReturnValueOnce({});
      const settings = usePageSettings();
      expect(settings).toEqual({
        showVideos: true,
      });
    });

    it('should include the global settings', () => {
      usePageConfig.mockReturnValueOnce({
        settings: {
          showVideos: true,
        },
      });
      useSettings.mockReturnValueOnce({
        foo: 'bar',
      });
      const settings = usePageSettings();
      expect(settings).toEqual({
        showVideos: true,
        foo: 'bar',
      });
    });
  });
});
