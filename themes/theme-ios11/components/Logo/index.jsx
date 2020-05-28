import React from 'react';
import PropTypes from 'prop-types';
import appConfig from '@shopgate/pwa-common/helpers/config';
import styles from './style';
import connect from './connector';

/**
 * The Logo component.
 * @return {JSX}
 */
const Logo = ({ showLogo }) => {
  if (!showLogo) {
    return null;
  }

  return (
    <div className={styles.container}>
      <img
        className={styles.image}
        src={appConfig.logo || appConfig.logoFallback}
        alt={appConfig.shopName}
      />
    </div>
  );
};

Logo.propTypes = {
  showLogo: PropTypes.bool,
};

Logo.defaultProps = {
  showLogo: true,
};

export default connect(Logo);
