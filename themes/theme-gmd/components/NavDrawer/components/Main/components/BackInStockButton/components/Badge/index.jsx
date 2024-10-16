import React, { memo } from 'react';
import connect from './connector';
import styles from './style';

/**
 * @param {number} visible Whether or not the user has back in stock subscriptions.
 * @returns {JSX}
 */
const BackInStockButtonBadge = ({ visible }) => (
  (visible > 0) && <span className={`${styles} theme__nav-drawer__back-in-stock-button-badge theme__badge`} />
);

export default connect(memo(BackInStockButtonBadge));
