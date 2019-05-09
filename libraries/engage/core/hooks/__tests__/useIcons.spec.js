import { useConfig } from '../useConfig';
import { useIcons } from '../useIcons';

jest.mock('../useConfig', () => ({
  useConfig: jest.fn(),
}));

describe('engage > core > hooks', () => {
  describe('useIcons()', () => {
    it('should return an empty object if no icons are specified.', () => {
      useConfig.mockReturnValueOnce({});
      const icons = useIcons();
      expect(icons).toEqual({});
    });

    it('should return an object a test icon.', () => {
      useConfig.mockReturnValueOnce({
        assets: {
          icons: {
            test: '<svg />',
          },
        },
      });
      const icons = useIcons();
      expect(icons).toEqual({
        test: '<svg />',
      });
    });
  });
});
