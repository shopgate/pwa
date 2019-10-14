import React, {
  useState, useEffect, useCallback, memo,
} from 'react';
import PropTypes from 'prop-types';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import Content from './components/Content';
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

  const style = useCallback(() => ({
    background: active ? colors.accent : colors.background,
    color: active ? colors.accentContrast : colors.dark,
  }), [active]);

  return (
    <div className={styles} data-test-id="filterBar" style={style()}>
      <Content />
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
