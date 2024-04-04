import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { themeConfig } from '@shopgate/engage';
import {
  Link, CheckedIcon, Button, NotificationIcon,
} from '@shopgate/engage/components';
import { BACK_IN_STOCK_PATTERN } from '@shopgate/engage/back-in-stock/constants';
import { i18n } from '@shopgate/engage/core';
import styles from './style';
import connect from './connector';

const { colors } = themeConfig;
/**
 * This component renders a button to subscribe a product or a hint
 * that the product is already subscribed
 * @param {Object} props The component props
 * @param {boolean} props.isLinkToBackInStockEnabled Whether the link to the back in
 * stock page is active
 * @param {boolean} props.stopPropagation Stop event propagation
 * @param {string} props.productId The product id
 * @param {Object} props.subscription The subscription
 * @param {Function} props.addBackInStockSubscription Add product to back in stock list
 * @param {Function} props.grantPushPermissions Request / Set push permission
 * @return {JSX.Element}
 */
const BackInStockButton = ({
  productId,
  isLinkToBackInStockEnabled = false,
  subscription,
  stopPropagation = false,
  addBackInStockSubscription,
  grantPushPermissions,
  alignRight,
  showAsButton,
}) => {
  const handleClick = useCallback(async (event) => {
    if (stopPropagation) {
      event.stopPropagation();
    }
    const allowed = await grantPushPermissions({
      useRationaleModal: true,
      useSettingsModal: true,
      rationaleModal: {
        message: 'back_in_stock.rationale.message',
        confirm: 'back_in_stock.rationale.confirm',
        dismiss: 'common.cancel',
      },
    });
    if (allowed) {
      addBackInStockSubscription({ productId });
    }
  }, [addBackInStockSubscription, grantPushPermissions, productId, stopPropagation]);

  if (subscription?.status === 'active') {
    return (
      <Link
        href={BACK_IN_STOCK_PATTERN}
        disabled={!isLinkToBackInStockEnabled}
        className={classNames(
          styles.backInStockMessageContainer,
          { [styles.rightAligned]: alignRight }
        )}
        tag="span"
      >
        <CheckedIcon
          color={colors.success}
          className={alignRight ? styles.icon : classNames(styles.iconCentered, styles.icon)}
        />
        <span className={styles.backInStockMessage}>{i18n.text('back_in_stock.we_will_remind_you')}</span>
      </Link>
    );
  }

  if (showAsButton) {
    return (
      <Button
        type="primary"
        tabIndex={0}
        onClick={handleClick}
        className={styles.button}
      >
        <span className={styles.buttonText}>
          {i18n.text('back_in_stock.get_notified')}
        </span>
      </Button>
    );
  }
  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid,jsx-a11y/click-events-have-key-events
    <a
      role="button"
      tabIndex={0}
      onClick={handleClick}
      className={classNames(
        styles.button,
        { [styles.rightAligned]: alignRight }
      )}
    >
      <NotificationIcon color={colors.primary} className={styles.icon} />
      <span className={styles.buttonText}>
        {i18n.text('back_in_stock.get_notified')}
      </span>
    </a>
  );
};

BackInStockButton.propTypes = {
  addBackInStockSubscription: PropTypes.func.isRequired,
  grantPushPermissions: PropTypes.func.isRequired,
  alignRight: PropTypes.bool,
  isLinkToBackInStockEnabled: PropTypes.bool,
  productId: PropTypes.string,
  showAsButton: PropTypes.bool,
  stopPropagation: PropTypes.bool,
  subscription: PropTypes.shape(),
};

BackInStockButton.defaultProps = {
  stopPropagation: false,
  isLinkToBackInStockEnabled: false,
  showAsButton: false,
  alignRight: false,
  subscription: null,
  productId: null,
};

export default connect(BackInStockButton);
