import React from 'react';
import { pure } from 'recompose';
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

export default consume(pure(FavoritesButtonBadge));
