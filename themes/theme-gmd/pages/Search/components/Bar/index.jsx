import React from 'react';
import { Consume } from '@shopgate/engage/components';
import { RouteContext } from '@shopgate/engage/core';
import { ViewContext } from 'Components/View/context';
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
