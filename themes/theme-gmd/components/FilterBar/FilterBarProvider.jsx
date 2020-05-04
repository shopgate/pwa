import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { router } from '@shopgate/engage/core';
import { responsiveCondition } from '@shopgate/engage/styles';
import { buildUpdatedFilters } from '@shopgate/engage/filter';
import Context from './FilterBarProvider.context';
import connect from './FilterBarProvider.connector';

/**
 * FilterBar provider
 * @param {Object} props React props.
 * @returns {JSX}
 */
const FilterBarProvider = ({
  children,
  navigate,
  routeFilterState,
  updateFilters,
}) => {
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const contextValue = useMemo(() => ({
    /**
     * Opens the filter page or modal
     * @returns {Object}
     */
    openFilters: () => {
      if (responsiveCondition('>xs', { webOnly: true })) {
        return setFilterModalOpen(true);
      }
      return navigate();
    },
    /**
     * Applies filter to given route.
     * @param {string} id Route id.
     * @param {Object} filters Newly set filters.
     * @param {Object} currentFilters Default filters.
     * @returns {Object}
     */
    applyFilters: (id, filters, currentFilters) => {
      const newFilters = buildUpdatedFilters(currentFilters, filters);
      setFilterModalOpen(false);
      router.update(id, { filters: newFilters });
      return updateFilters(newFilters);
    },
    /**
     * Resets the filters on given route.
     * @param {string} id Route id.
     * @returns {Object}
     */
    resetFilters: (id) => {
      setFilterModalOpen(false);
      router.update(id, { filters: {} });
      return updateFilters({});
    },
    filters: routeFilterState,
    filterModalOpen,
    setFilterModalOpen,
  }), [filterModalOpen, navigate, routeFilterState, updateFilters]);

  return (
    <Context.Provider value={contextValue}>
      {children}
    </Context.Provider>
  );
};

FilterBarProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  navigate: PropTypes.func.isRequired,
  updateFilters: PropTypes.func.isRequired,
  routeFilterState: PropTypes.shape(),
};

FilterBarProvider.defaultProps = {
  routeFilterState: {},
};

export default connect(FilterBarProvider);
