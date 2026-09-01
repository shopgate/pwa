import React, { useState, useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer } from '@shopgate/engage/components';
import { SortProvider, SORT_SCOPE_CATEGORY, SORT_SCOPE_SEARCH } from '@shopgate/engage/filter';
import { makeStyles } from '@shopgate/engage/styles';
import Provider from './FilterBarProvider';
import Content from './components/Content';
import Modal from './components/FilterModal';

const useStyles = makeStyles()(theme => ({
  root: {
    transition: 'transform 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
    background: theme.palette.background.surface,
    color: theme.palette.text.primary,
    borderBottom: `1px solid ${theme.components.separatorLine.borderColor}`,
  },
}));

/**
 * The FilterBar component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const FilterBar = ({ categoryId }) => {
  const { classes, cx } = useStyles();
  const [filterCount, setFilterCount] = useState(0);

  const sortScope = useMemo(
    () => (categoryId ? SORT_SCOPE_CATEGORY : SORT_SCOPE_SEARCH),
    [categoryId]
  );

  return (
    <div className={cx(classes.root, 'theme__filter-bar')} data-test-id="filterBar">
      <SortProvider scope={sortScope}>
        <Provider>
          <Content onChipCountUpdate={setFilterCount} filterCount={filterCount} />
          <ResponsiveContainer breakpoint=">xs" webOnly>
            <Modal />
          </ResponsiveContainer>
        </Provider>
      </SortProvider>
    </div>
  );
};

FilterBar.propTypes = {
  categoryId: PropTypes.string,
};

FilterBar.defaultProps = {
  categoryId: null,
};

export default memo(FilterBar);
