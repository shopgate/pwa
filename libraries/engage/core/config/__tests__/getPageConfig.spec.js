import { getPageConfig } from '../getPageConfig';
import { getThemeConfig } from '../getThemeConfig';

jest.mock('../getThemeConfig', () => ({
  getThemeConfig: jest.fn(),
}));

const requestedPagePattern = '/requested/page';

describe('engage > core > config', () => {
  describe('getPageConfig()', () => {
    it('should return an empty object if no pages are defined in the theme config.', () => {
      getThemeConfig.mockReturnValueOnce({});
      expect(getPageConfig(requestedPagePattern)).toEqual({});
    });

    it('should return an empty object if the page is not found.', () => {
      getThemeConfig.mockReturnValueOnce({ pages: [] });
      expect(getPageConfig(requestedPagePattern)).toEqual({});
    });

    it('should only return the page, which matches the given pattern.', () => {
      getThemeConfig.mockReturnValueOnce({
        pages: [{
          pattern: '/some/other/page',
          name: 'OtherPage',
        }, {
          pattern: requestedPagePattern,
          name: 'Correct page',
        }, {
          pattern: '/yet/another/page',
          name: 'YetAnotherPage',
        }],
      });
      expect(getPageConfig(requestedPagePattern)).toEqual({
        pattern: requestedPagePattern,
        name: 'Correct page',
      });
    });
  });
});
