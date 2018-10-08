import React from 'react';
import Consume from '@shopgate/pwa-common/components/Consume';
import { RouteContext } from '@virtuous/react-conductor/Router';
import { ViewContext } from 'Components/View/context';
import FilterBar from 'Components/FilterBar';

const routeMap = {
  filters: 'state.filters',
  categoryId: 'params.categoryId',
};

const viewMap = {
  ref: 'ref.current',
};

/**
 * @returns {JSX}
 */
const CategoryBar = () => (
  <Consume context={RouteContext} props={routeMap}>
    {({ categoryId, filters }) => (
      <Consume context={ViewContext} props={viewMap}>
        {({ ref }) => (
          <FilterBar
            categoryId={categoryId}
            filters={filters}
            viewRef={ref}
          />
        )}
      </Consume>
    )}
  </Consume>
);

export default CategoryBar;
