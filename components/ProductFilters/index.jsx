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
const CategoryContent = ({ categoryId, hasProducts }) => {
  const { state } = useRoute();
  return (
    <ScrollHeader className={filters}>
      <ResponsiveContainer appAlways breakpoint="<=xs">
        <GlobalLocationSwitcher renderBar />
      </ResponsiveContainer>

      {hasProducts && (
        <FilterBar
          categoryId={categoryId}
          filters={state.filters}
        />
      )}
    </ScrollHeader>
  );
};

CategoryContent.propTypes = {
  categoryId: PropTypes.string.isRequired,
  hasProducts: PropTypes.bool,
};

CategoryContent.defaultProps = {
  hasProducts: false,
};

export default CategoryContent;
