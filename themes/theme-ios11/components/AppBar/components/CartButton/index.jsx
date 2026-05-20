import React, { Fragment, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { AppBar, CartIcon } from '@shopgate/pwa-ui-ios';
import { Portal } from '@shopgate/pwa-common/components';
import {
  APP_BAR_CART_BUTTON,
  APP_BAR_CART_BUTTON_BEFORE,
  APP_BAR_CART_BUTTON_AFTER,
} from '@shopgate/pwa-common/constants/Portals';
import { withWidgetSettings, i18n } from '@shopgate/engage/core';
import { makeStyles } from '@shopgate/engage/styles';
import Badge from './components/CartBadge';
import connect from './connector';

const useStyles = makeStyles()({
  root: {
    flexShrink: 0,
    height: 44,
    overflow: 'hidden',
    width: 44,
  },
});

/**
 * @returns {JSX}
 */
const Icon = () => (
  <CartIcon size={20} />
);

/**
 * The CartButton component.
 * @param {Object} props Component props.
 * @param {number} props.count Cart item count.
 * @param {Function} props.navigate Opens the cart.
 * @param {Object} props.widgetSettings App bar widget settings.
 * @returns {JSX.Element}
 */
const CartButton = ({ count, navigate, widgetSettings }) => {
  const { classes } = useStyles();

  const {
    buttonCartBackground,
    buttonCartColor,
    buttonCartBadgeBackground,
    buttonCartBadgeColor,
  } = widgetSettings;

  const iconStyle = useMemo(() => ({
    background: buttonCartBackground,
    color: buttonCartColor,
  }), [buttonCartBackground, buttonCartColor]);

  const badgeStyle = useMemo(() => ({
    background: buttonCartBadgeBackground,
    color: buttonCartBadgeColor,
  }), [buttonCartBadgeBackground, buttonCartBadgeColor]);

  const renderBadge = useCallback(() => (
    <Badge style={badgeStyle} count={count} />
  ), [badgeStyle, count]);

  return (
    <Fragment key="cart">
      <Portal name={APP_BAR_CART_BUTTON_BEFORE} />
      <Portal name={APP_BAR_CART_BUTTON}>
        <div className={classes.root} data-test-id="CartButton">
          <AppBar.Icon
            {...iconStyle}
            badge={renderBadge}
            icon={Icon}
            onClick={navigate}
            aria-label={i18n.text('navigation.cart')}
          />
        </div>
      </Portal>
      <Portal name={APP_BAR_CART_BUTTON_AFTER} />
    </Fragment>
  );
};

CartButton.propTypes = {
  count: PropTypes.number.isRequired,
  navigate: PropTypes.func.isRequired,
  widgetSettings: PropTypes.shape().isRequired,
};

export default withWidgetSettings(connect(CartButton), '@shopgate/engage/components/AppBar');
