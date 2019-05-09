import { usePageConfig } from '../usePageConfig';
import { usePageSettings } from '../usePageSettings';

jest.mock('../usePageConfig', () => ({
  usePageConfig: jest.fn(),
}));

describe('engage > core > hooks', () => {
  describe('usePageSettings()', () => {
    it('should return an empty object if no settings', () => {
      usePageConfig.mockReturnValueOnce({});
      const settings = usePageSettings();
      expect(settings).toEqual({});
    });

    it('should return an object containing language and currency.', () => {
      usePageConfig.mockReturnValueOnce({
        settings: {
          showVideos: true,
        },
      });
      const settings = usePageSettings();
      expect(settings).toEqual({
        showVideos: true,
      });
    });
  });
});
