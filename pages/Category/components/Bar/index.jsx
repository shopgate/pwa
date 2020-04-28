import React, { Fragment, useContext } from 'react';
import { useRoute } from '@shopgate/engage/core';
import { ViewContext } from '@shopgate/engage/components';
import FilterBar from 'Components/FilterBar';
import PageTitleBar from 'Components/PageTitleBar';

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
      <PageTitleBar />
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
