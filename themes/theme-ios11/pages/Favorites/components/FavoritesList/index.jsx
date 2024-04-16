import React from 'react';
import { FavoriteLists } from '@shopgate/engage/favorites';
import styles from './style';

/**
 * @param {Object} props The component props.
 * @return {JSX}
 */
const FavoritesList = () => (
  <div className={styles.container}>
    <FavoriteLists />
  </div>
);

export default FavoritesList;
