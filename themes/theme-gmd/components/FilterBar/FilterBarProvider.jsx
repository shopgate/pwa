import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { responsiveCondition } from '@shopgate/engage/styles';
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
    updateFilters,
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
