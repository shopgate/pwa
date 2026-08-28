import {
  useMemo, useState, useEffect, useCallback,
} from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import { router } from '@shopgate/engage/core';
import { useRoute } from '@shopgate/engage/core/hooks';
import { parseObjectToQueryString } from '@shopgate/engage/core/helpers';
import { getFiltersByHash } from '@shopgate/engage/filter';
import Context from './FilterPageProvider.context';
import type { APIFilter, RouteFilters } from './FilterPageProvider.context';
import { buildInitialFilters, buildUpdatedFilters } from '../helpers';

const FILTER_PATH_SUFFIX = '/filter';

/**
 * A single stored filter value carrying id and label.
 */
interface StoredFilterValue {
  /** Filter value id. */
  id: string;
  /** Filter value label. */
  label: string;
}

/**
 * A filter as kept in the provider's internal state. `value` holds either the selected values of a
 * list filter or the `[min, max]` tuple of a range filter.
 */
interface StoredFilter {
  id?: string;
  type?: string;
  label?: string;
  source?: string;
  value: Array<StoredFilterValue | string | number>;
}

type StoredFilters = Record<string, StoredFilter>;

type ContextValue = ComponentProps<typeof Context.Provider>['value'];

const buildInitialFiltersTyped = buildInitialFilters as unknown as (
  filters: APIFilter[] | null,
  activeFilters: RouteFilters | Record<string, never> | null
) => StoredFilters;

const buildUpdatedFiltersTyped = buildUpdatedFilters as unknown as (
  initialFilters: StoredFilters,
  updatedFilters: StoredFilters
) => RouteFilters | null;

interface FilterPageProviderProps {
  /** Array of available filters, injected from Redux. */
  filters?: APIFilter[] | null;
  /** Object with the active filters for a filtered product list. */
  activeFilters?: RouteFilters | null;
  /** Id of the route with the product list that's supposed to be filtered. */
  parentRouteId?: string | null;
  /** Callback invoked when users pressed the apply button. */
  onApply?: (filters: RouteFilters | null) => void;
  /** Provider children. */
  children?: ReactNode;
}

/**
 * Maps the available filters from the application state onto the provider props.
 * @returns The mapped state props.
 */
const mapStateToProps = (state: unknown, props: unknown) => ({
  filters: getFiltersByHash(state, props),
});

/**
 * Compares the mapped state props to decide whether the connected component needs to re-render.
 * @returns Whether the state props are considered equal.
 */
const areStatePropsEqual = (
  next: { filters?: APIFilter[] | null },
  prev: { filters?: APIFilter[] | null }
): boolean => {
  if ((!prev.filters && next.filters) || (!isEqual(prev.filters, next.filters))) {
    return false;
  }

  return true;
};

/**
 * The FilterPageProvider component provides all relevant data and callbacks to represent and modify
 * the current state of the "filter" page.
 * @returns The rendered component.
 */
const FilterPageProvider = ({
  filters: filtersProp = null,
  activeFilters: activeFiltersProp = null,
  parentRouteId = null,
  onApply = () => setTimeout(router.pop, 250),
  children = null,
}: FilterPageProviderProps) => {
  const { pathname, query } = useRoute() as { pathname: string; query: Record<string, unknown> };
  const [currentFilters, setCurrentFilters] = useState<StoredFilters>(
    (activeFiltersProp || {}) as unknown as StoredFilters
  );

  /**
   * Storage that hosts an object that represents the initial state of the filters page.
   * It's created from the "filters" array that contains all available filters, and the
   * "activeFilters" object that represents filters with an active value selection.
   */
  const [initialFilters, setInitialFilters] = useState<StoredFilters>(
    buildInitialFiltersTyped(filtersProp, activeFiltersProp)
  );

  /**
   * Storage that hosts an object that represents the a partial state of the filters page with
   * all filters that where modified since the filters page was opened.
   */
  const [changedFilters, setChangedFilters] = useState<StoredFilters>({});

  // Object that represents the current state of all filters
  const mergedFilters = useMemo(() => ({
    ...initialFilters,
    ...changedFilters,
  }), [changedFilters, initialFilters]);

  /**
   * Effect that updates the "initialFilters" state when it doesn't have content yet
   */
  useEffect(() => {
    setInitialFilters((currentState) => {
      if (Object.keys(currentState).length > 0) {
        return currentState;
      }

      return buildInitialFiltersTyped(filtersProp, activeFiltersProp);
    });
  }, [activeFiltersProp, filtersProp]);

  /**
   * Whether a reset of the active filters is possible.
   *
   * Reset is possible whenever filters where selected by the user before, or when filters where
   * modified since the filters page was opened.
   */
  const resetPossible = useMemo(
    () => !!(Object.keys(currentFilters).length || Object.keys(changedFilters).length),
    [changedFilters, currentFilters]
  );

  /**
   * Whether the filter selection has changed since the filters page was opened
   */
  const hasChanged = useMemo(() => (
    Object.keys(changedFilters).length > 0
    || !!(Object.keys(currentFilters).length === 0 && activeFiltersProp)
  ), [activeFiltersProp, changedFilters, currentFilters]);

  const getSelectedFilterValues = useCallback(
    (filterId: string): string[] => {
      const value = changedFilters[filterId]
        ? changedFilters[filterId].value
        : initialFilters[filterId]?.value || [];

      return value.map(entry => (typeof entry === 'object' ? entry.id : entry) as string);
    }, [changedFilters, initialFilters]
  );

  /**
   * Resets all filters which have been changed by the user
   */
  const resetAllFilters = useCallback(() => {
    setInitialFilters(buildInitialFiltersTyped(filtersProp, {}));
    setCurrentFilters({});
    setChangedFilters({});
  }, [filtersProp]);

  /**
   * Resets all filters which have been changed by the user since the filters page was opened
   */
  const resetChangedFilters = useCallback(() => {
    setChangedFilters({});
  }, []);

  const updateChangedFilterInternal = useCallback(
    (filterId: string, selectedValues: StoredFilter) => {
      setChangedFilters(currentState => ({
        ...currentState,
        [filterId]: selectedValues,
      }));
    }, []
  );

  const removeChangedFilterInternal = useCallback(
    (filterId: string) => {
      setChangedFilters((currentState) => {
        const remainingFilters = { ...currentState };
        delete remainingFilters[filterId];
        return remainingFilters;
      });
    }, []
  );

  const updateSelectedFilterValues = useCallback(debounce(
    (filterId: string, selectedValues: string[]) => {
      const filter = (filtersProp || []).find(entry => entry.id === filterId);

      if (!filter) {
        return;
      }

      const { value: initialValues } = initialFilters[filterId];

      const hasValueList = Array.isArray(filter.values);

      const orderByFilter = (ids: Array<string | number>): Array<string | number> => (hasValueList
        ? filter.values.filter(entry => ids.includes(entry.id)).map(entry => entry.id)
        : ids);

      const selectedValueIds = orderByFilter(selectedValues);
      const initialValueIds = orderByFilter(
        initialValues.map(entry => (typeof entry === 'object' ? entry.id : entry))
      );

      /**
       * When the filter update would recreate the state that the filter initially had, we
       * remove the filter from the changedFilters storage.
       *
       * That enables proper behavior for the "reset" and "update" button states.
       */
      if (initialValueIds.length === selectedValueIds.length
        && initialValueIds.every((initial, i) => initial === selectedValueIds[i])) {
        removeChangedFilterInternal(filterId);
        return;
      }

      let stateValue: Array<StoredFilterValue | string | number> = [...selectedValueIds];

      if (hasValueList) {
        /**
         * The selectedValues array only contains a list of ids.
         * For the getProducts request that's dispatched after the current filter selection was
         * applied, id and label is required at the filter values level.
         */
        stateValue = (selectedValueIds as string[])
          .map(valueId => filter.values.find(entry => entry.id === valueId))
          .filter((match): match is (typeof filter.values)[number] => Boolean(match))
          .map(match => ({
            id: match.id,
            label: match.label,
          }));
      }

      updateChangedFilterInternal(filterId, {
        id: filterId,
        type: filter.type,
        label: filter.label,
        value: stateValue,
        ...(filter.source && { source: filter.source }),
      });
    }, 50
  ), [filtersProp, initialFilters, removeChangedFilterInternal, updateChangedFilterInternal]);

  /**
   * Applies the current filter selection to the parent route with a product list to be filtered.
   * When the filter page was entered directly, no parent route exists in the history stack. In
   * that case the product list route is derived from the current pathname and replaces the
   * filter page.
   */
  const applyFilters = useCallback(() => {
    const filters = buildUpdatedFiltersTyped(currentFilters, changedFilters);

    if (!parentRouteId) {
      router.replace({
        pathname: `${pathname.slice(0, -FILTER_PATH_SUFFIX.length)}${parseObjectToQueryString(query)}`,
        state: { filters },
      } as unknown as Parameters<typeof router.replace>[0]);
      return;
    }

    router.update(
      parentRouteId,
      { filters } as Parameters<typeof router.update>[1]
    );

    onApply(filters);
  }, [changedFilters, currentFilters, onApply, parentRouteId, pathname, query]);

  const value = useMemo<ContextValue>(() => ({
    resetPossible,
    hasChanged,
    apiFilters: filtersProp || [],
    filters: mergedFilters,
    resetAllFilters,
    resetChangedFilters,
    getSelectedFilterValues,
    updateSelectedFilterValues,
    applyFilters,
  } as unknown as ContextValue), [
    hasChanged,
    resetPossible,
    filtersProp,
    mergedFilters,
    resetAllFilters,
    resetChangedFilters,
    getSelectedFilterValues,
    updateSelectedFilterValues,
    applyFilters,
  ]);

  return (
    <Context.Provider value={value}>
      { children }
    </Context.Provider>
  );
};

export default connect(
  mapStateToProps,
  null,
  null,
  { areStatePropsEqual }
)(FilterPageProvider);
