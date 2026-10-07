import { REVIEW_FILTERS } from '../constants';
import type { ReviewListFilters } from '../types/reviews';

type FilterInput = Partial<Record<keyof ReviewListFilters, boolean>> | null;

const PARAMS = REVIEW_FILTERS.map(filter => filter.param) as (keyof ReviewListFilters)[];

/**
 * Reduces filter flags to the active filters.
 * @param filters Filter flags by request parameter.
 * @returns The active filters, or undefined when none is active.
 */
export const getActiveReviewFilters = (filters?: FilterInput): ReviewListFilters | undefined => {
  const active: ReviewListFilters = {};

  PARAMS.forEach((param) => {
    if (filters?.[param]) {
      active[param] = true;
    }
  });

  return Object.keys(active).length > 0 ? active : undefined;
};

/**
 * Compares two sets of list filters.
 * @param a Filter flags by request parameter.
 * @param b Filter flags by request parameter.
 * @returns Whether the same filters are active in both.
 */
export const areReviewFiltersEqual = (a?: FilterInput, b?: FilterInput): boolean => (
  PARAMS.every(param => !!a?.[param] === !!b?.[param])
);
