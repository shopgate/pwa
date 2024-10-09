import React from 'react';
import PropTypes from 'prop-types';
import { useRoute } from '@shopgate/engage/core';
import { ResponsiveContainer, ScrollHeader, SurroundPortals } from '@shopgate/engage/components';
import { GlobalLocationSwitcher, FulfillmentSlotSwitcher } from '@shopgate/engage/locations';
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
      <SurroundPortals portalName="filter-bar.content">
        <ResponsiveContainer appAlways breakpoint="<=xs">
          <GlobalLocationSwitcher renderBar />
          <FulfillmentSlotSwitcher renderBar />
        </ResponsiveContainer>

        {showFilters && (
        <FilterBar
          categoryId={categoryId}
          filters={state.filters}
        />
        )}
      </SurroundPortals>
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
