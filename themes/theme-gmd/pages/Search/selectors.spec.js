import { getResultByHash } from '@shopgate/pwa-common-commerce/product/selectors/product';
import { showNoResults } from './selectors';

jest.mock('@shopgate/pwa-common-commerce/product/selectors/product', () => ({
  getResultByHash: jest.fn(),
}));
jest.mock('@shopgate/pwa-common-commerce/filter/selectors', () => ({
  hasActiveFilters: jest.fn(() => false),
}));
jest.mock('@shopgate/engage/core/helpers', () => ({
  hasNewServices: jest.fn(() => false),
}));

describe('Search selectors', () => {
  describe('showNoResults()', () => {
    const state = {};

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it.each([
      ['an empty', ''],
      ['a missing', undefined],
    ])('should return true for %s search phrase', (_, searchPhrase) => {
      getResultByHash.mockReturnValue(null);
      expect(showNoResults(state, { searchPhrase })).toBe(true);
    });

    it('should return false when results for a search phrase are not available yet', () => {
      getResultByHash.mockReturnValue(null);
      expect(showNoResults(state, { searchPhrase: 'shoes' })).toBe(false);
    });

    it('should return false while results are fetching', () => {
      getResultByHash.mockReturnValue({ isFetching: true });
      expect(showNoResults(state, { searchPhrase: 'shoes' })).toBe(false);
    });

    it('should return false when products were found', () => {
      getResultByHash.mockReturnValue({
        isFetching: false,
        products: ['p1'],
      });
      expect(showNoResults(state, { searchPhrase: 'shoes' })).toBe(false);
    });

    it('should return true when no products were found', () => {
      getResultByHash.mockReturnValue({
        isFetching: false,
        products: [],
      });
      expect(showNoResults(state, { searchPhrase: 'shoes' })).toBe(true);
    });
  });
});
