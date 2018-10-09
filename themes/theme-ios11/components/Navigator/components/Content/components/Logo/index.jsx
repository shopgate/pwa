import React from 'react';
import appConfig from '@shopgate/pwa-common/helpers/config';
import styles from './style';

/**
 * The navigator logo component.
 * @return {JSX}
 */
const Logo = () => <img className={styles} src={appConfig.logo} alt={appConfig.shopName} />;

export default Logo;
