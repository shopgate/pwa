import { getThemeAssets } from '../getThemeAssets';
import { getThemeConfig } from '../getThemeConfig';

jest.mock('../getThemeConfig', () => ({
  getThemeConfig: jest.fn(),
}));

describe('engage > core > config', () => {
  describe('getThemeAssets()', () => {
    it('should return an empty object if no assets are available without using a key.', () => {
      getThemeConfig.mockReturnValueOnce({});
      const assets = getThemeAssets();
      expect(assets).toEqual({});
    });

    it('should return all theme assets when no key is passed.', () => {
      getThemeConfig.mockReturnValueOnce({
        assets: {
          logo: 'some-logo',
          icons: {},
        },
      });
      const assets = getThemeAssets();
      expect(assets).toEqual({
        logo: 'some-logo',
        icons: {},
      });
    });

    it('should return only a single theme asset entry, matching the given key.', () => {
      getThemeConfig.mockReturnValueOnce({
        assets: {
          logo: 'some-logo',
          icons: {},
        },
      });
      const assets = getThemeAssets('logo');
      expect(assets).toEqual('some-logo');
    });

    it('should return undefined if the requested asset key does not exist.', () => {
      getThemeConfig.mockReturnValueOnce({
        assets: {
          logo: 'some-logo',
          icons: {},
        },
      });
      const assets = getThemeAssets('other');
      expect(assets).toBeUndefined();
    });
  });
});
