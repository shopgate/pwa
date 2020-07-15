import React, { Fragment, useContext } from 'react';
import { useRoute } from '@shopgate/engage/core';
import { ViewContext, ResponsiveContainer } from '@shopgate/engage/components';
import { GlobalLocationSwitcher } from '@shopgate/engage/locations';
import FilterBar from 'Components/FilterBar';

type Props = {
  hasChildren: boolean,
  hasProducts: boolean,
}

/**
 * @returns {JSX}
 */
function CategoryBar({ hasChildren, hasProducts }: Props) {
  const { state, params } = useRoute();
  const { ref } = useContext(ViewContext);

  return (
    <Fragment>
      {!hasChildren && (
        <ResponsiveContainer appAlways breakpoint="<=xs">
          <GlobalLocationSwitcher renderBar />
        </ResponsiveContainer>
      )}

      {(!hasChildren && hasProducts) && (
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
