import React, {
  useState, useMemo, memo, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { hasNewServices } from '@shopgate/engage/core/helpers';
import { themeConfig } from '@shopgate/engage';
import { SortProvider, SORT_SCOPE_CATEGORY, SORT_SCOPE_SEARCH } from '@shopgate/engage/filter';
import Content from './components/Content';
import styles from './style';

const { colors } = themeConfig;

/**
 * The FilterBar component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function FilterBar({ filters, categoryId }) {
  const [active, setActive] = useState(filters !== null && Object.keys(filters).length > 0);

  const handleChipCountUpdate = useCallback((count) => {
    setActive(count > 0);
  }, []);

  const style = useMemo(() => (hasNewServices() ? {
    background: active
      ? 'var(--color-background-accent)'
      : 'var(--color-background-accent)',
    color: active
      ? 'var(--color-primary)'
      : 'var(--color-text-high-emphasis)',
  } : {
    background: active ? 'var(--color-secondary)' : colors.background,
    color: active ? 'var(--color-secondary-contrast)' : colors.dark,
  }), [active]);

  const sortScope = useMemo(
    () => (categoryId ? SORT_SCOPE_CATEGORY : SORT_SCOPE_SEARCH),
    [categoryId]
  );

  return (
    <div className={`${styles} theme__filter-bar`} data-test-id="filterBar" style={style}>
      <SortProvider scope={sortScope}>
        <Content onChipCountUpdate={handleChipCountUpdate} />
      </SortProvider>
    </div>
  );
}

FilterBar.propTypes = {
  categoryId: PropTypes.string,
  filters: PropTypes.shape(),
};

FilterBar.defaultProps = {
  categoryId: null,
  filters: null,
};

export default memo(FilterBar);
