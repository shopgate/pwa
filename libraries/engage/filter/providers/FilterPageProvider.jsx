import React, {
  useMemo, useState, useEffect, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import { router } from '@shopgate/engage/core';
import {
  getFiltersByHash,
} from '@shopgate/engage/filter';
// eslint-disable-next-line no-unused-vars, import/named
import Context, { APIFilter, RouteFilters } from './FilterPageProvider.context';
import { buildInitialFilters, buildUpdatedFilters } from '../helpers';

/**
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @returns {Object}
 */
const mapStateToProps = (state, props) => ({
  filters: getFiltersByHash(state, props),
});

/**
 * @param {Object} next The next component props.
 * @param {Object} prev The previous component props.
 * @returns {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if ((!prev.filters && next.filters) || (!isEqual(prev.filters, next.filters))) {
    return false;
  }

  return true;
};

/**
 * The FilterPageProvider component provides all relevant data and callbacks to represent and modify
 * the current state of the "filter" page.
 * @param {Object} props Provider props
 * @param {APIFilter[]} props.filters Array of available filters
 * @param {RouteFilters} props.activeFilters Object with the active filters for a filtered product
 * list
 * @param {string} props.parentRouteId Id of the route with the product list that's supposed to be
 * filtered
 * @param {Function} [props.onApply] Callback invoked when users pressed the apply button
 * @param {string} [props.categoryId] A category to be used for filter selection from Redux
 * @param {string} [props.searchPhrase] A search phrase to be used for filter selection from Redux
 * @param {NodeList} children Provider children
 * @returns {JSX.Element}
 */
const FilterPageProvider = ({
  filters: filtersProp,
  activeFilters: activeFiltersProp,
  parentRouteId,
  onApply,
  children,
}) => {
  const [currentFilters, setCurrentFilters] = useState(activeFiltersProp || {});

  /**
   * Storage that hosts an object that represents the initial state of the filters page.
   * It's created from the "filters" array that contains all available filters, and the
   * "activeFilters" object that represents filters with an active value selection.
   */
  const [initialFilters, setInitialFilters] = useState(
    buildInitialFilters(filtersProp, activeFiltersProp)
  );

  /**
   * Storage that hosts an object that represents the a partial state of the filters page with
   * all filters that where modified since the filters page was opened.
   */
  const [changedFilters, setChangedFilters] = useState({});

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

      return buildInitialFilters(filtersProp, activeFiltersProp);
    });
  }, [activeFiltersProp, filtersProp]);

  /**
   * Whether a reset of the active filters is possible.
   *
   * Reset is possible whenever filters where selected by the user before, or when filters where
   * modified since the filters page was opened.
   * @type {boolean}
   */
  const resetPossible = useMemo(
    () => !!(Object.keys(currentFilters).length || Object.keys(changedFilters).length),
    [changedFilters, currentFilters]
  );

  /**
   * Whether the filter selection has changed since the filters page was opened
   * @type {boolean}
   */
  const hasChanged = useMemo(() => (
    Object.keys(changedFilters).length > 0
    || !!(Object.keys(currentFilters).length === 0 && activeFiltersProp)
  ), [activeFiltersProp, changedFilters, currentFilters]);

  /**
   * Retrieves a list of currently selected values for a filter
   * @callback getSelectedFilterValues
   * @param {string} filterId The id of the filter
   * @returns {string[]}
   */
  const getSelectedFilterValues = useCallback(
    /**
     * @param {string} filterId The id of the filter
     * @returns {string[]}
     */
    (filterId) => {
      const value = changedFilters[filterId]
        ? changedFilters[filterId].value
        : initialFilters[filterId]?.value || [];

      return value.map(entry => entry.id || entry);
    }, [changedFilters, initialFilters]
  );

  /**
   * Resets all filters which have been changed by the user
   */
  const resetAllFilters = useCallback(() => {
    setInitialFilters(buildInitialFilters(filtersProp, {}));
    setCurrentFilters({});
    setChangedFilters({});
  }, [filtersProp]);

  /**
   * Resets all filters which have been changed by the user since the filters page was opened
   */
  const resetChangedFilters = useCallback(() => {
    setChangedFilters({});
  }, []);

  /**
   * Adds or updates the selection for a changed filter
   * @callback updateChangedFilterInternal
   * @param {string} filterId The id of the filter to be updated
   * @param {string[]} selectedValues The updated selected values
   */
  const updateChangedFilterInternal = useCallback(
    /**
     * @param {string} filterId The id of the filter to be updated
     * @param {string[]} selectedValues The updated selected values
     */
    (filterId, selectedValues) => {
      setChangedFilters(currentState => ({
        ...currentState,
        [filterId]: selectedValues,
      }));
    }, []
  );

  /**
   * Removes a changed filter
   * @callback removeChangedFilterInternal
   * @param {string} filterId The id of the filter to be updated
   * @param {string[]} selectedValues The updated selected values
   */
  const removeChangedFilterInternal = useCallback(
    /**
     * @param {string} filterId The id of the filter to be removed
     */
    (filterId) => {
      setChangedFilters((currentState) => {
      // Separate the given id from the other set filters.
        const { [filterId]: removed, ...remainingFilters } = currentState;
        return remainingFilters;
      });
    }, []
  );

  /**
   * Updates the selection for a filter
   *
   * @param {string} filterId The id of the filter to be updated
   * @param {string[]} selectedValues The updated selected values
   */
  const updateSelectedFilterValues = useCallback(debounce(
    /**
     * @param {string} filterId The id of the filter to be updated
     * @param {string[]} selectedValues The updated selected values
     */
    (filterId, selectedValues) => {
      // Retrieve data of filter to be updated from the filters array.
      const filter = filtersProp.find(entry => entry.id === filterId);

      // Retrieve the values for the updated filter that where set when the filter page was opened
      const { value: initialValues } = initialFilters[filterId];

      // Prepare the update payload
      let stateValue = [...selectedValues];

      /**
       * No initial values where set for this filter, and the update contains no values. So we
       * can remove the filter from the changedFilters storage.
       */
      if (initialValues.length === 0 && selectedValues.length === 0) {
        removeChangedFilterInternal(filterId);
        return;
      }

      /**
       * When the filter update would recreate the state that the filter initially had, we
       * remove the filter from the changedFilters storage.
       *
       * That enables proper behavior for the "reset" and "update" button states.
       */
      if (initialValues.length !== 0 && selectedValues.length !== 0) {
        if (initialValues.every((initial, i) => initial === selectedValues[i])) {
          removeChangedFilterInternal(filterId);
          return;
        }
      }

      if (Array.isArray(filter.values)) {
        /**
         * The selectedValues array only contains a list of ids.
         * For the getProducts request that's dispatched after the current filter selection was
         * applied, id and label is required at the filter values level.
         */
        stateValue = selectedValues.map((valueId) => {
          const match = filter.values.find(entry => entry.id === valueId);

          return {
            id: match.id,
            label: match.label,
          };
        });
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
   * Applies the current filter selection to the parent route with a product list to be filtered
   */
  const applyFilters = useCallback(() => {
    const filters = buildUpdatedFilters(currentFilters, changedFilters);

    router.update(
      parentRouteId,
      { filters }
    );

    onApply(filters);
  }, [changedFilters, currentFilters, onApply, parentRouteId]);

  const value = useMemo(() => ({
    resetPossible,
    hasChanged,
    apiFilters: filtersProp || [],
    filters: mergedFilters,
    resetAllFilters,
    resetChangedFilters,
    getSelectedFilterValues,
    updateSelectedFilterValues,
    applyFilters,
  }), [
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

FilterPageProvider.propTypes = {
  activeFilters: PropTypes.shape(),
  children: PropTypes.node,
  filters: PropTypes.arrayOf(PropTypes.shape()),
  onApply: PropTypes.func,
  parentRouteId: PropTypes.string,
};

FilterPageProvider.defaultProps = {
  children: null,
  activeFilters: null,
  parentRouteId: null,
  filters: null,
  onApply: () => setTimeout(router.pop, 250),
};

/**
 * @type FilterPageProvider
 */
export default connect(mapStateToProps, null, null, { areStatePropsEqual })(FilterPageProvider);
