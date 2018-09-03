import React, { Fragment } from 'react';
import Sort from './components/Sort';
import FilterButton from './components/FilterButton';
import FilterChips from './components/FilterChips';
import styles from './style';

/**
 * The FilterBarContent component.
 * @returns {JSX}
 */
const FilterBarContent = () => (
  <Fragment>
    <div className={styles}>
      <Sort />
      <FilterButton />
    </div>
    <FilterChips />
  </Fragment>
);

export default FilterBarContent;
