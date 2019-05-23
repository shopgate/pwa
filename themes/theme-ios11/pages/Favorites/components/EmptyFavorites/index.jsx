import React from 'react';
import { I18n } from '@shopgate/engage/components';
import styles from './style';
import Icon from './components/Icon';

/**
 * @return {JSX}
 */
const EmptyFavorites = () => (
  <div className={styles.container}>
    <div className={styles.iconContainer} data-test-id="emptyFavComponent">
      <Icon />
      <I18n.Text string="favorites.empty" className={styles.title} />
    </div>
  </div>
);

export default EmptyFavorites;
