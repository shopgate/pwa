import React, { useContext } from 'react';
import { useRoute } from '@shopgate/engage/core';
import { ViewContext } from 'Components/View/context';
import FilterBar from 'Components/FilterBar';

/**
 * @returns {JSX}
 */
function CategoryBar() {
  const { state, params } = useRoute();
  const { ref } = useContext(ViewContext);

  return (
    <FilterBar
      categoryId={params.categoryId}
      filters={state.filters}
      viewRef={ref ? ref.current : null}
    />
  );
}

export default CategoryBar;
