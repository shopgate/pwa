import { areReviewFiltersEqual, getActiveReviewFilters } from './filters';

describe('Reviews helpers: filters', () => {
  describe('getActiveReviewFilters', () => {
    it('should keep only active known filters', () => {
      expect(getActiveReviewFilters({
        filterMedia: true,
        filterVerified: false,
      })).toEqual({ filterMedia: true });
    });

    it('should return undefined when no filter is active', () => {
      expect(getActiveReviewFilters()).toBeUndefined();
      expect(getActiveReviewFilters(null)).toBeUndefined();
      expect(getActiveReviewFilters({ filterMedia: false })).toBeUndefined();
    });
  });

  describe('areReviewFiltersEqual', () => {
    it('should treat missing and inactive filters alike', () => {
      expect(areReviewFiltersEqual(undefined, {})).toBe(true);
      expect(areReviewFiltersEqual({ filterMedia: false }, undefined)).toBe(true);
      expect(areReviewFiltersEqual({ filterMedia: true }, { filterMedia: true })).toBe(true);
    });

    it('should detect a differing filter', () => {
      expect(areReviewFiltersEqual({ filterMedia: true }, undefined)).toBe(false);
      expect(areReviewFiltersEqual({ filterMedia: true }, {
        filterMedia: true,
        filterVerified: true,
      })).toBe(false);
    });
  });
});
