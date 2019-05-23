import React from 'react';
import { I18n } from '@shopgate/engage/components';
import styles from './style';

/**
 * The CouponsHint components
 * @returns {JSX}
 */
const CouponsHint = () => <I18n.Text className={styles} string="cart.coupons_not_supported" />;

export default CouponsHint;
