import React from 'react';
import Consume from '@shopgate/pwa-common/components/Consume';
import { RouteContext } from '@shopgate/pwa-common/context';
import { ViewContext } from '@shopgate/engage/components/View';
import FilterBar from 'Components/FilterBar';

const routeMap = {
  filters: 'state.filters',
  searchPhrase: 'query.s',
};

const viewMap = {
  ref: 'ref',
  setTop: 'setTop',
};

/**
 * @returns {JSX}
 */
const SearchBar = () => (
  <Consume context={RouteContext} props={routeMap}>
    {({ searchPhrase, filters }) => (
      <Consume context={ViewContext} props={viewMap}>
        {({ ref, setTop }) => (
          <FilterBar
            searchPhrase={searchPhrase}
            filters={filters}
            setTop={setTop}
            viewRef={ref}
          />
        )}
      </Consume>
    )}
  </Consume>
);

export default SearchBar;
