import React, { Fragment, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import { AppBar } from '@shopgate/pwa-ui-material';
import { CartIcon } from '@shopgate/pwa-ui-shared';
import { Portal } from '@shopgate/pwa-common/components';
import {
  APP_BAR_CART_BUTTON,
  APP_BAR_CART_BUTTON_BEFORE,
  APP_BAR_CART_BUTTON_AFTER,
} from '@shopgate/pwa-common/constants/Portals';
import { withWidgetSettings, i18n } from '@shopgate/engage/core';
import { makeStyles } from '@shopgate/engage/styles';
import Badge from '../CartBadge';
import connect from './connector';
import transition from './transition';

const useStyles = makeStyles()({
  root: {
    flexShrink: 0,
    overflow: 'hidden',
    transition: 'width 250ms cubic-bezier(0.25, 0.1, 0.25, 1)',
  },
});

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
    background: buttonCartBackground || 'var(--color-primary)',
    color: buttonCartColor || 'var(--color-primary-contrast)',
  }), [buttonCartBackground, buttonCartColor]);

  const badgeStyle = useMemo(() => ({
    background: buttonCartBadgeBackground,
    color: buttonCartBadgeColor,
  }), [buttonCartBadgeBackground, buttonCartBadgeColor]);

  const renderBadge = useCallback(() => (
    <Badge style={badgeStyle} count={count} />
  ), [badgeStyle, count]);

  const ariaLabel = `${i18n.text('navigation.cart')}. ${i18n.text('common.products')}: ${count}.`;

  return (
    <Transition in={count > 0} timeout={250}>
      {state => (
        <Fragment key="cart">
          <Portal name={APP_BAR_CART_BUTTON_BEFORE} />
          <Portal name={APP_BAR_CART_BUTTON}>
            <div className={classes.root} style={transition[state]}>
              <AppBar.Icon
                {...iconStyle}
                badge={renderBadge}
                icon={CartIcon}
                onClick={navigate}
                testId="CartButton"
                aria-label={ariaLabel}
                aria-hidden={!count}
              />
            </div>
          </Portal>
          <Portal name={APP_BAR_CART_BUTTON_AFTER} />
        </Fragment>
      )}
    </Transition>
  );
};

CartButton.propTypes = {
  count: PropTypes.number.isRequired,
  navigate: PropTypes.func.isRequired,
  widgetSettings: PropTypes.shape().isRequired,
};

export default withWidgetSettings(connect(CartButton), '@shopgate/engage/components/AppBar');
