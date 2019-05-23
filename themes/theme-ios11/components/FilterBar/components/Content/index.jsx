import React, { Fragment } from 'react';
import { RouteContext } from '@shopgate/engage/core';
import { ViewContext } from 'Components/View/context';
import { Consume } from '@shopgate/engage/components';
import Sort from './components/Sort';
import FilterButton from './components/FilterButton';
import FilterChips from './components/FilterChips';
import styles from './style';

const mapRoute = {
  filters: 'state.filters',
  routeId: 'id',
};

const mapView = {
  scrollTop: 'scrollTop',
};

/**
 * The FilterBarContent component.
 * @returns {JSX}
 */
const FilterBarContent = () => (
  <Fragment>
    <div className={styles}>
      <Sort />
      <FilterButton />
    </div>
    <Consume context={RouteContext} props={mapRoute}>
      {({ filters, routeId }) => (
        <Consume context={ViewContext} props={mapView}>
          {({ scrollTop }) => (
            <FilterChips filters={filters} routeId={routeId} scrollTop={scrollTop} />
          )}
        </Consume>
      )}
    </Consume>
  </Fragment>
);

export default FilterBarContent;
