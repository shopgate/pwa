import React, { memo } from 'react';
import connect from './connector';
import styles from './style';

/**
 * @param {number} props.visible Whether or not the user has favorites.
 * @returns {JSX}
 */
const FavoritesButtonBadge = ({ visible }) => (
  (visible > 0) && <span className={`${styles} theme__nav-drawer__favorites-button-badge theme__badge`} />
);

export default connect(memo(FavoritesButtonBadge));
