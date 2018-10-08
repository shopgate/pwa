import React from 'react';
import appConfig from '@shopgate/pwa-common/helpers/config';
import styles from './style';

/**
 * The Logo component.
 * @return {JSX}
 */
const Logo = () => (
  <div className={styles.container}>
    <img className={styles.image} src={appConfig.logo} alt={appConfig.shopName} />
  </div>
);

export default Logo;
