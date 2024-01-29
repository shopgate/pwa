import React from 'react';
import NotificationIcon from '@shopgate/pwa-ui-shared/icons/NotificationIcon';
import CheckedIcon from '@shopgate/pwa-ui-shared/icons/CheckedIcon';
import PropTypes from 'prop-types';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import Link from '@shopgate/pwa-common/components/Link';
import { BACK_IN_STOCK_PATTERN } from '@shopgate/engage/back-in-stock';
import { Button } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core';
import styles from './style';

const { colors } = themeConfig;
/**
 * This component renders a button to subscribe a product or a hint
 * that the product is already subscribed
 * @param {Object} props The component props
 * @param {boolean} props.isLintToBackInStockEnabled Whether the link to the back in
 * stock page is active
 * @param {boolean} props.isSubscribed Whether the product is already subscribed
 * @param {Function} props.onClick Action to subscribe the product
 * @return {JSX}
 */
const BackInStockButton = ({
  onClick,
  isSubscribed = false,
  isLintToBackInStockEnabled = false,
}) => {
  if (isSubscribed) {
    return (
      <Link
        href={BACK_IN_STOCK_PATTERN}
        disabled={!isLintToBackInStockEnabled}
        className={styles.backInStockMessageContainer}
        tag="span"
      >
        <CheckedIcon color={colors.success} className={styles.icon} />
        <span className={styles.backInStockMessage}>{i18n.text('back_in_stock.we_will_remind_you')}</span>
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
  isLintToBackInStockEnabled: PropTypes.bool,
};

BackInStockButton.defaultProps = {
  isLintToBackInStockEnabled: false,
};

export default BackInStockButton;
