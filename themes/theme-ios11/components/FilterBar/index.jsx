import React, {
  useState, useEffect, useMemo, memo, useRef, useLayoutEffect,
} from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { useWidgetSettings } from '@shopgate/engage/core';
import { ScrollHeader } from '@shopgate/engage/components';
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
  const [offsetTop, setOffsetTop] = useState(0);

  const containerRef = useRef();

  useLayoutEffect(() => {
    if (offsetTop === 0) {
      const currentOffset = get(containerRef, 'current.offsetTop');
      setOffsetTop(currentOffset);
    }
  });

  useEffect(() => {
    setActive(filters !== null && Object.keys(filters).length > 0);
  }, [filters]);

  const style = useMemo(() => ({
    background: active ? colors.accent : colors.background,
    color: active ? colors.accentContrast : colors.dark,
  }), [active]);

  const inlineStyle = {
    ...style,
    top: offsetTop || -2,
  };

  return (
    <ScrollHeader hideOnScroll={hideOnScroll} scrollOffset={offset}>
      <div className={`${styles} theme__filter-bar`} data-test-id="filterBar" style={inlineStyle} ref={containerRef}>
        <Content />
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
