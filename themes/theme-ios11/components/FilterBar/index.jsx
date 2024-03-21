import React, {
  useState, useEffect, useMemo, memo,
} from 'react';
import PropTypes from 'prop-types';
import isPlainObject from 'lodash/isPlainObject';
import { useWidgetSettings } from '@shopgate/engage/core';
import { ScrollHeader, SurroundPortals } from '@shopgate/engage/components';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import Content from './components/Content';
import styles from './style';

const { colors, variables: { scroll: { offset = 100 } = {} } } = themeConfig || {};

/**
 * The FilterBar component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function FilterBar({ filters }) {
  const { hideOnScroll } = useWidgetSettings('@shopgate/engage/components/FilterBar');
  const [active, setActive] = useState(filters !== null && Object.keys(filters).length > 0);

  const sanitizedFilters = useMemo(() => {
    if (!isPlainObject(filters)) {
      return filters;
    }

    // Remove "hidden" filters from filters object
    return Object.keys(filters).reduce((acc, filterKey) => {
      const filter = filters[filterKey];

      if (!filter?.isHidden) {
        acc[filterKey] = filter;
      }

      return acc;
    }, {});
  }, [filters]);

  useEffect(() => {
    setActive(sanitizedFilters !== null && Object.keys(sanitizedFilters).length > 0);
  }, [filters, sanitizedFilters]);

  const style = useMemo(() => ({
    background: active ? colors.accent : colors.background,
    color: active ? colors.accentContrast : colors.dark,
  }), [active]);

  return (
    <ScrollHeader hideOnScroll={hideOnScroll} scrollOffset={offset}>
      <div className={`${styles} theme__filter-bar`} data-test-id="filterBar" style={style}>
        <SurroundPortals portalName="filter-bar.content">
          <Content />
        </SurroundPortals>
      </div>
    </ScrollHeader>
  );
}

FilterBar.propTypes = {
  filters: PropTypes.shape(),
};

FilterBar.defaultProps = {
  filters: null,
};

export default memo(FilterBar);
