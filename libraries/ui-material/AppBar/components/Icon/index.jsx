import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';

/**
 * @param {Function} props.icon The icon to render.
 * @param {Function} props.onClick The callback to execute upon click.
 * @returns {JSX}
 */
function AppBarIcon({
  background, badge: Badge, color, icon: Icon, onClick,
}) {
  return (
    <button
      className={styles}
      onClick={onClick}
      style={{
        background,
        color,
      }}
    >
      <Icon />
      {Badge && <Badge />}
    </button>
  );
}

AppBarIcon.propTypes = {
  icon: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  background: PropTypes.string,
  badge: PropTypes.func,
  color: PropTypes.string,
};

AppBarIcon.defaultProps = {
  background: 'inherit',
  badge: null,
  color: 'inherit',
};

export default AppBarIcon;
