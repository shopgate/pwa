import { usePageConfig } from '../usePageConfig';
import { useRoute } from '../useRoute';
import { getPageConfig } from '../../config/getPageConfig';

jest.mock('../useRoute', () => ({
  useRoute: jest.fn(),
}));

jest.mock('../../config/getPageConfig', () => ({
  getPageConfig: jest.fn(),
}));

describe('engage > core > hooks', () => {
  describe('usePageConfig()', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should pass down the page pattern to the lower level helper functions.', () => {
      useRoute.mockReturnValue({ pattern: '/page/pattern' });
      usePageConfig();
      expect(getPageConfig).toBeCalledWith('/page/pattern');
      expect(getPageConfig).toBeCalledTimes(1);
      expect(useRoute).toBeCalledTimes(1);
    });

    it('should return what it got from the helper function without messing with references.', () => {
      useRoute.mockReturnValue({ pattern: '/page/pattern' });
      const testPageConfig = {
        pattern: '/page/pattern',
        settings: { custom: '123' },
        widgets: [],
      };
      getPageConfig.mockReturnValue(testPageConfig);
      const result = usePageConfig();
      expect(result === testPageConfig).toBeTruthy();
    });
  });
});
