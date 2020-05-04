import React, { Fragment, useContext } from 'react';
import { useRoute } from '@shopgate/engage/core';
import { ViewContext } from '@shopgate/engage/components/View';
import { useFilterBarContext } from '../../FilterBarProvider.context';
import Sort from './components/Sort';
import FilterButton from './components/FilterButton';
import FilterChips from './components/FilterChips';
import styles from './style';

/**
 * The filter bar content component.
 * @returns {JSX}
 */
function FilterBarContent() {
  const { state, id: routeId } = useRoute();
  const { scrollTop } = useContext(ViewContext);
  const { openFilters } = useFilterBarContext();
  const { filters } = state;

  return (
    <Fragment>
      <div className={styles}>
        <Sort />
        <FilterButton openFilters={openFilters} />
      </div>
      <FilterChips
        openFilters={openFilters}
        filters={filters}
        routeId={routeId}
        scrollTop={scrollTop}
      />
    </Fragment>
  );
}

export default FilterBarContent;
