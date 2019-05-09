import { useConfig } from '../useConfig';
import { useAssets } from '../useAssets';

jest.mock('../useConfig', () => ({
  useConfig: jest.fn(),
}));

describe('engage > core > hooks', () => {
  describe('useAssets()', () => {
    it('should return an empty object if no assets are specified', () => {
      useConfig.mockReturnValueOnce({});
      const assets = useAssets();
      expect(assets).toEqual({});
    });

    it('should return an object containing a logo and icons', () => {
      useConfig.mockReturnValueOnce({
        assets: {
          logo: '',
          icons: {},
        },
      });
      const assets = useAssets();
      expect(assets).toEqual({
        logo: '',
        icons: {},
      });
    });
  });
});
