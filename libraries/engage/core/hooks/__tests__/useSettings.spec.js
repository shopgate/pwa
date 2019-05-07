import { useConfig } from '../useConfig';
import { useSettings } from '../useSettings';

jest.mock('../useConfig', () => ({
  useConfig: jest.fn(),
}));

describe('engage > core > hooks', () => {
  describe('useSettings()', () => {
    it('should return an empty object if no settings', () => {
      useConfig.mockReturnValueOnce({});
      const settings = useSettings();
      expect(settings).toEqual({});
    });

    it('should return an object containing language and currency.', () => {
      useConfig.mockReturnValueOnce({
        settings: {
          currency: 'USD',
          language: 'en-US',
        },
      });
      const settings = useSettings();
      expect(settings).toEqual({
        currency: 'USD',
        language: 'en-US',
      });
    });
  });
});
