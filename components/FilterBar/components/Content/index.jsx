import React, { Fragment } from 'react';
import { RouteContext } from '@virtuous/react-conductor/Router';
import Consume from '@shopgate/pwa-common/components/Consume';
import Sort from './components/Sort';
import FilterButton from './components/FilterButton';
import FilterChips from './components/FilterChips';
import styles from './style';

const map = {
  filters: 'state.filters',
  routeId: 'id',
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
    <Consume context={RouteContext} props={map}>
      {({ filters, routeId }) => <FilterChips filters={filters} routeId={routeId} />}
    </Consume>
  </Fragment>
);

export default FilterBarContent;
