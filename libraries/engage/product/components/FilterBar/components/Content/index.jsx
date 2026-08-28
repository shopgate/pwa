import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { useRoute } from '@shopgate/engage/core';
import { makeStyles } from '@shopgate/engage/styles';
import { ViewContext } from '@shopgate/engage/components/View';
import { useFilterBarContext } from '../../FilterBarProvider.context';
import Sort from './components/Sort';
import FilterButton from './components/FilterButton';
import FilterChips from './components/FilterChips';

const useStyles = makeStyles()({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
});

/**
 * The filter bar content component.
 * @returns {JSX}
 */
function FilterBarContent({ onChipCountUpdate, filterCount }) {
  const { classes } = useStyles();
  const { state, id: routeId } = useRoute();
  const { scrollTop } = useContext(ViewContext);
  const { openFilters } = useFilterBarContext();
  const { filters } = state;

  return (
    <>
      <div className={classes.root}>
        <Sort />
        <FilterButton openFilters={openFilters} filterCount={filterCount} />
      </div>
      <FilterChips
        openFilters={openFilters}
        filters={filters}
        routeId={routeId}
        scrollTop={scrollTop}
        onChipCountUpdate={onChipCountUpdate}
      />
    </>
  );
}

FilterBarContent.propTypes = {
  filterCount: PropTypes.number,
  onChipCountUpdate: PropTypes.func,
};

FilterBarContent.defaultProps = {
  filterCount: 0,
  onChipCountUpdate: noop,
};

export default FilterBarContent;
