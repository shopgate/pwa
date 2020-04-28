import React, { Fragment } from 'react';
import Consume from '@shopgate/pwa-common/components/Consume';
import { RouteContext } from '@shopgate/pwa-common/context';
import { ViewContext } from '@shopgate/engage/components/View';
import FilterBar from 'Components/FilterBar';
import PageTitleBar from 'Components/PageTitleBar';

const routeMap = {
  filters: 'state.filters',
  searchPhrase: 'query.s',
};

const viewMap = {
  ref: 'ref',
  setTop: 'setTop',
};

type Props = {
  showFilterBar: boolean,
}

/**
 * @returns {JSX}
 */
const SearchBar = ({ showFilterBar }: Props) => (
  <Consume context={RouteContext} props={routeMap}>
    {({ searchPhrase, filters }) => (
      <Consume context={ViewContext} props={viewMap}>
        {({ ref, setTop }) => (
          <Fragment>
            <PageTitleBar />
            { showFilterBar && (
              <FilterBar
                searchPhrase={searchPhrase}
                filters={filters}
                setTop={setTop}
                viewRef={ref}
              />
            )}
          </Fragment>

        )}
      </Consume>
    )}
  </Consume>
);

export default SearchBar;
