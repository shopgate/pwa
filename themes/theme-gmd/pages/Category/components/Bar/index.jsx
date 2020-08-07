import React, { Fragment, useContext } from 'react';
import { useRoute } from '@shopgate/engage/core';
import { ViewContext, ResponsiveContainer } from '@shopgate/engage/components';
import { GlobalLocationSwitcher } from '@shopgate/engage/locations';
import FilterBar from 'Components/FilterBar';
import PageTitleBar from 'Components/PageTitleBar';

type Props = {
  hasProducts: boolean,
}

/**
 * @returns {JSX}
 */
function CategoryBar({ hasProducts }: Props) {
  const { state, params } = useRoute();
  const { ref } = useContext(ViewContext);

  return (
    <Fragment>
      <PageTitleBar />
      <ResponsiveContainer appAlways breakpoint="<=xs">
        <GlobalLocationSwitcher renderBar />
      </ResponsiveContainer>

      {hasProducts && (
        <FilterBar
          categoryId={params.categoryId}
          filters={state.filters}
          viewRef={ref ? ref.current : null}
        />
      )}
    </Fragment>
  );
}

export default CategoryBar;
