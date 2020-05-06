import React, {
  useState, useEffect, useMemo, memo,
} from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer } from '@shopgate/engage/components';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import Provider from './FilterBarProvider';
import Content from './components/Content';
import Modal from './components/FilterModal';
import styles from './style';

const { colors } = themeConfig;

/**
 * The FilterBar component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function FilterBar({ filters }) {
  const [active, setActive] = useState(filters !== null && Object.keys(filters).length > 0);

  useEffect(() => {
    setActive(filters !== null && Object.keys(filters).length > 0);
  }, [filters]);

  const style = useMemo(
    () => ({
      background: active
        ? `var(--color-secondary, ${colors.accent})`
        : `var(--color-background-accent, ${colors.background})`,
      color: active
        ? `var(--color-secondary-contrast, ${colors.accentContrast})`
        : `var(--color-text-high-emphasis, ${colors.dark})`,
    }),
    [active]
  );

  return (
    <div className={styles} data-test-id="filterBar" style={style}>
      <Provider>
        <Content />
        <ResponsiveContainer breakpoint=">xs" webOnly>
          <Modal />
        </ResponsiveContainer>
      </Provider>
    </div>
  );
}

FilterBar.propTypes = {
  filters: PropTypes.shape(),
};

FilterBar.defaultProps = {
  filters: null,
};

export default memo(FilterBar);
