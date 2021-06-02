import React, { memo } from 'react';
import connect from './connector';
import styles from './style';

/**
 * @param {number} props.visible Whether or not the user has favorites.
 * @returns {JSX}
 */
const FavoritesButtonBadge = ({ visible }) => (
  (visible > 0) && <span className={styles} />
);

export default connect(memo(FavoritesButtonBadge));
