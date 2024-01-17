import React from 'react';
import NotificationIcon from '@shopgate/pwa-ui-shared/icons/NotificationIcon';
import CheckedIcon from '@shopgate/pwa-ui-shared/icons/CheckedIcon';
import PropTypes from 'prop-types';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import Link from '@shopgate/pwa-common/components/Link';
import { BACK_IN_STOCK_PATTERN } from '@shopgate/engage/back-in-stock';
import { i18n } from '@shopgate/engage/core';
import styles from './style';

const { colors } = themeConfig;
/**
 * This component renders a button to subscribe a product or a hint
 * that the product is already subscribed
 * @param {Object} props The component props
 * @param {boolean} props.isLinkToBackInStockEnabled Whether the link to the back in
 * stock page is active
 * @param {Object} props.subscription The subscription
 * @param {Function} props.onClick Action to subscribe the product
 * @return {JSX}
 */
const BackInStockButton = ({
  onClick,
  isLinkToBackInStockEnabled = false,
  subscription,
}) => {
  if (subscription?.status === 'active') {
    return (
      <Link
        href={BACK_IN_STOCK_PATTERN}
        disabled={!isLinkToBackInStockEnabled}
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
      {/* eslint-disable-next-line max-len */}
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid,jsx-a11y/interactive-supports-focus,jsx-a11y/click-events-have-key-events */}
      <a role="button" onClick={onClick} className={styles.button}>
        <div className={styles.buttonContent}>
          <NotificationIcon color={colors.primary} />
          <span className={styles.buttonText}>{i18n.text('back_in_stock.get_notified')}</span>
        </div>
      </a>
    </div>);
};

BackInStockButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  isLinkToBackInStockEnabled: PropTypes.bool,
  subscription: PropTypes.shape(),
};

BackInStockButton.defaultProps = {
  isLinkToBackInStockEnabled: false,
  subscription: null,
};

export default BackInStockButton;
