import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useWidgetSettings } from '@shopgate/engage/core';
import { CART_MAX_ITEMS } from '@shopgate/engage/cart';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  root: {
    position: 'absolute',
    fontSize: '0.7rem',
    lineHeight: 1.5,
    fontWeight: 700,
    background: 'var(--color-primary)',
    color: 'var(--color-primary-contrast)',
    borderRadius: theme.spacing(1),
    height: theme.spacing(2),
    minWidth: theme.spacing(2),
    paddingLeft: (theme.spacing(0.5)),
    paddingRight: (theme.spacing(0.5)),
    top: 6,
    right: 4,
  },
}));

/**
 * The CartButtonBadge component.
 * @returns {JSX}
 */
const CartButtonBadge = ({ count, style }) => {
  const { classes } = useStyles();
  const settings = useWidgetSettings('@shopgate/engage/components/AppBar');

  if (!count) {
    return null;
  }

  const badgeStyle = {
    ...style,
    boxShadow: settings.buttonCartBadgeShadow,
  };

  const productCount = count > CART_MAX_ITEMS ? `${CART_MAX_ITEMS}+` : count;

  return (
    <div style={badgeStyle} className={`${classes.root} theme__app-bar__cart-button-badge theme__badge`} data-test-id="badge">{productCount}</div>
  );
};

CartButtonBadge.propTypes = {
  count: PropTypes.number.isRequired,
  style: PropTypes.shape(),
};

CartButtonBadge.defaultProps = {
  style: null,
};

export default memo(CartButtonBadge);
