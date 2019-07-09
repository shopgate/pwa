import { usePageSettings } from '../usePageSettings';
import { useRoute } from '../useRoute';
import { getPageSettings } from '../../config/getPageSettings';

jest.mock('../useRoute', () => ({
  useRoute: jest.fn(),
}));

jest.mock('../../config/getPageSettings', () => ({
  getPageSettings: jest.fn(),
}));

describe('engage > core > hooks', () => {
  describe('usePageSettings()', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should pass down its given param and the page pattern to the lower level helper functions.', () => {
      useRoute.mockReturnValue({ pattern: '/page/pattern' });
      usePageSettings('customKey');
      expect(getPageSettings).toBeCalledWith('/page/pattern', 'customKey');
      expect(getPageSettings).toBeCalledTimes(1);
      expect(useRoute).toBeCalledTimes(1);
    });

    it('should return what it got from the helper function without messing with references.', () => {
      useRoute.mockReturnValue({ pattern: '/page/pattern' });
      const testPageSettings = { custom: 'setting-123' };
      getPageSettings.mockReturnValue(testPageSettings);
      const result = usePageSettings();
      expect(result === testPageSettings).toBeTruthy();
    });
  });
});
