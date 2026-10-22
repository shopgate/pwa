import { REVIEW_FILTERS } from '../constants';
import type {
  ReviewFilterOption,
  ReviewListFilterInput,
  ReviewListFilters,
} from '../types/reviews';

const FILTERS = REVIEW_FILTERS as ReviewFilterOption[];

/**
 * Reduces filter values to the active filters. A toggle is active for any truthy value, the
 * rate filter only for a whole number of stars from 1 to 5.
 * @param filters Filter values by request parameter.
 * @returns The active filters, or undefined when none is active.
 */
export const getActiveReviewFilters = (
  filters?: ReviewListFilterInput | null
): ReviewListFilters | undefined => {
  const active: ReviewListFilters = {};

  FILTERS.forEach(({ param, type }) => {
    const value = filters?.[param];

    if (type === 'rate') {
      if (typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 5) {
        active.filterRate = value;
      }
    } else if (value && param !== 'filterRate') {
      active[param] = true;
    }
  });

  return Object.keys(active).length > 0 ? active : undefined;
};

/**
 * Compares two sets of list filters.
 * @param a Filter values by request parameter.
 * @param b Filter values by request parameter.
 * @returns Whether the same filters are active with the same values in both.
 */
export const areReviewFiltersEqual = (
  a?: ReviewListFilterInput | null,
  b?: ReviewListFilterInput | null
): boolean => (
  FILTERS.every(({ param }) => (a?.[param] || undefined) === (b?.[param] || undefined))
);
