import React from 'react';
import PropTypes from 'prop-types';
import appConfig from '@shopgate/pwa-common/helpers/config';
import styles from './style';

/**
 * The Logo component.
 * @return {JSX}
 */
const Logo = ({ className, onClick }) => (
  /* eslint-disable jsx-a11y/click-events-have-key-events */
  /* eslint-disable jsx-a11y/no-static-element-interactions */
  <div
    onClick={onClick}
    className={`${styles.container} ${className}`}
  >
    <img className={styles.image} src={appConfig.logo} alt={appConfig.shopName} />
  </div>
  /* eslint-enable jsx-a11y/no-static-element-interactions */
  /* eslint-enable jsx-a11y/click-events-have-key-events */
);

Logo.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
};

Logo.defaultProps = {
  className: '',
  onClick: () => {},
};

export default Logo;
