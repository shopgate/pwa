import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useWidgetSettings } from '@shopgate/engage/core';
import { CART_MAX_ITEMS } from '@shopgate/engage/cart';
import { Badge } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(() => ({
  root: {
    position: 'absolute',
    top: 6,
    right: 4,
  },
}));

/**
 * The CartButtonBadge component.
 * @returns {JSX}
 */
const CartButtonBadge = ({ count }) => {
  const { classes, cx } = useStyles();
  const settings = useWidgetSettings('@shopgate/engage/components/AppBar');

  // Only the shadow is configurable here — the badge color is owned by the badge
  // theme config so this bubble always matches the tab bar counters.
  const badgeStyle = {
    boxShadow: settings.buttonCartBadgeShadow,
  };

  return (
    <Badge
      count={count}
      max={CART_MAX_ITEMS}
      style={badgeStyle}
      className={cx(classes.root, 'theme__app-bar__cart-button-badge')}
      data-test-id="badge"
    />
  );
};

CartButtonBadge.propTypes = {
  count: PropTypes.number.isRequired,
};

export default memo(CartButtonBadge);
