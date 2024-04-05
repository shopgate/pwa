import React, { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { useRoute } from '@shopgate/engage/core';
import { ViewContext } from '@shopgate/engage/components/View';
import Sort from './components/Sort';
import FilterButton from './components/FilterButton';
import FilterChips from './components/FilterChips';
import styles from './style';

/**
 * The filter bar content component.
 * @returns {JSX}
 */
function FilterBarContent({ onChipCountUpdate }) {
  const { state, id: routeId } = useRoute();
  const { scrollTop } = useContext(ViewContext);
  const { filters } = state;

  return (
    <Fragment>
      <div className={styles}>
        <Sort />
        <FilterButton />
      </div>
      <FilterChips
        filters={filters}
        routeId={routeId}
        scrollTop={scrollTop}
        onChipCountUpdate={onChipCountUpdate}
      />
    </Fragment>
  );
}

FilterBarContent.propTypes = {
  onChipCountUpdate: PropTypes.func,
};

FilterBarContent.defaultProps = {
  onChipCountUpdate: noop,
};

export default FilterBarContent;
