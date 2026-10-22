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

  describe('getActiveReviewFilters with the rate filter', () => {
    it('should keep a whole number of stars from 1 to 5', () => {
      expect(getActiveReviewFilters({ filterRate: 5 })).toEqual({ filterRate: 5 });
      expect(getActiveReviewFilters({
        filterRate: 1,
        filterMedia: true,
      })).toEqual({
        filterRate: 1,
        filterMedia: true,
      });
    });

    it('should drop every other rate value', () => {
      [0, 6, 2.5, NaN, true, false, null, '5'].forEach((filterRate) => {
        expect(getActiveReviewFilters({ filterRate: filterRate as number })).toBeUndefined();
      });
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

    it('should compare the number of stars of the rate filter', () => {
      expect(areReviewFiltersEqual({ filterRate: 5 }, { filterRate: 5 })).toBe(true);
      expect(areReviewFiltersEqual({ filterRate: 5 }, { filterRate: 4 })).toBe(false);
      expect(areReviewFiltersEqual({ filterRate: 5 }, {})).toBe(false);
      expect(areReviewFiltersEqual({ filterRate: 0 }, undefined)).toBe(true);
    });
  });
});
