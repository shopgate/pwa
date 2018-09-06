import React from 'react';
import consume from './consumer';
import styles from './style';

/**
 * @param {number} props.visible Whether or not the user has favorites.
 * @returns {JSX}
 */
const FavoritesButtonBadge = ({ visible }) => (
  (visible > 0) && (
    <span className={styles} />
  )
);

export default consume(FavoritesButtonBadge);
