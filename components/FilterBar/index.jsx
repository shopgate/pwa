import React, {
  useState, useMemo, memo, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { SurroundPortals } from '@shopgate/engage/components';
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

  const style = useMemo(
    () => ({
      background: active
        ? `var(--color-background-accent, ${colors.accent})`
        : `var(--color-background-accent, ${colors.background})`,
      color: active
        ? `var(--color-primary, ${colors.accentContrast})`
        : `var(--color-text-high-emphasis, ${colors.dark})`,
    }),
    [active]
  );

  const sortScope = useMemo(
    () => (categoryId ? SORT_SCOPE_CATEGORY : SORT_SCOPE_SEARCH),
    [categoryId]
  );

  return (
    <div className={`${styles} theme__filter-bar`} data-test-id="filterBar" style={style}>
      <SortProvider scope={sortScope}>
        <SurroundPortals portalName="filter-bar.content">
          <Content onChipCountUpdate={handleChipCountUpdate} />
        </SurroundPortals>
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
