import React from 'react';
import NotificationIcon from '@shopgate/pwa-ui-shared/icons/NotificationIcon';
import CheckedIcon from '@shopgate/pwa-ui-shared/icons/CheckedIcon';
import PropTypes from 'prop-types';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import Link from '@shopgate/pwa-common/components/Link';
import { BACK_IN_STOCK_PATTERN } from '@shopgate/engage/back-in-stock';
import { Button } from '@shopgate/engage/components';
import styles from './style';

const { colors } = themeConfig;
/**
 * This component renders a button to subscribe a product or a hint
 * that the product is already subscribed
 * @param {Object} props The component props
 * @param {boolean} props.isSubscribed Whether the product is already subscribed
 * @param {Function} props.onClick Action to subscribe the product
 * @return {JSX}
 */
const BackInStockButton = ({
  onClick,
  isSubscribed = false,
}) => {
  if (isSubscribed) {
    return (
      <Link href={BACK_IN_STOCK_PATTERN} className={styles.backInStockMessageContainer}>
        <CheckedIcon color={colors.success} />
        <span className={styles.backInStockMessage}>We will notify you</span>
      </Link>
    );
  }

  return (
    <div>
      <Button
        flat
        type="plain"
        className={styles.button}
        onClick={onClick}
      >
        <div className={styles.buttonContent}>
          <NotificationIcon color={colors.primary} />
          <span className={styles.buttonText}>Get notified</span>
        </div>
      </Button>
    </div>);
};

BackInStockButton.propTypes = {
  isSubscribed: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default BackInStockButton;
