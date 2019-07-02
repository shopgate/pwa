import { getThemeConfig } from '../getThemeConfig';

const mockAppConfig = {
  beta: true,
};

// Mock the config object
jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  get beta() { return mockAppConfig.beta; },
  get theme() { return mockAppConfig.theme; },
}));

describe('engage > core > config', () => {
  describe('getThemeConfig()', () => {
    it('should return all theme config props.', () => {
      mockAppConfig.theme = 'someThemeConfig';
      expect(getThemeConfig()).toEqual('someThemeConfig');
      delete mockAppConfig.theme;
    });

    it('should return an empty object if the app config is empty.', () => {
      expect(getThemeConfig()).toEqual({});
    });
  });
});
