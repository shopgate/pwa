import React from 'react';
import PropTypes from 'prop-types';
import { useRoute } from '@shopgate/engage/core';
import { ResponsiveContainer, ScrollHeader } from '@shopgate/engage/components';
import { GlobalLocationSwitcher } from '@shopgate/engage/locations';
import FilterBar from 'Components/FilterBar';
import { filters } from './style';

/**
 * @param {Object} props.categoryId The category id.
 * @returns {JSX}
 */
const ProductFilters = ({ categoryId, showFilters }) => {
  const { state } = useRoute();
  return (
    <ScrollHeader className={filters}>
      <ResponsiveContainer appAlways breakpoint="<=xs">
        <GlobalLocationSwitcher renderBar />
      </ResponsiveContainer>

      {showFilters && (
        <FilterBar
          categoryId={categoryId}
          filters={state.filters}
        />
      )}
    </ScrollHeader>
  );
};

ProductFilters.propTypes = {
  categoryId: PropTypes.string,
  showFilters: PropTypes.bool,
};

ProductFilters.defaultProps = {
  showFilters: false,
  categoryId: null,
};

export default ProductFilters;
