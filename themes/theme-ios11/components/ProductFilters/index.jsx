import React from 'react';
import PropTypes from 'prop-types';
import { useWidgetSettings, useRoute } from '@shopgate/engage/core/hooks';
import { ResponsiveContainer, ScrollHeader, SurroundPortals } from '@shopgate/engage/components';
import { GlobalLocationSwitcher, FulfillmentSlotSwitcher } from '@shopgate/engage/locations';
import { themeConfig } from '@shopgate/engage';
import FilterBar from 'Components/FilterBar';
import { filters } from './style';

const { variables: { scroll: { offset = 100 } = {} } } = themeConfig || {};

/**
 * @param {Object} props.categoryId The category id.
 * @returns {JSX}
 */
const ProductFilters = ({ categoryId, showFilters }) => {
  const { hideOnScroll } = useWidgetSettings('@shopgate/engage/components/FilterBar');
  const { state } = useRoute();
  return (
    <ScrollHeader className={filters} hideOnScroll={hideOnScroll} scrollOffset={offset}>
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
