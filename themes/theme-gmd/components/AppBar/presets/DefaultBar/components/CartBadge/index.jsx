import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useWidgetSettings } from '@shopgate/engage/core';
import { CART_MAX_ITEMS } from '@shopgate/engage/cart';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  badge: {
    position: 'absolute',
    fontSize: '0.75rem',
    lineHeight: 1.4,
    fontWeight: 700,
    background: 'var(--color-primary-contrast)',
    color: 'var(--color-primary)',
    borderRadius: theme.spacing(1),
    height: theme.spacing(2),
    minWidth: theme.spacing(2),
    paddingLeft: (theme.spacing(0.5)),
    paddingRight: (theme.spacing(0.5)),
    top: 12,
    right: 18,
    transform: 'translateX(50%)',
  },
}));

/**
 * The CartButtonBadge component.
 * @returns {JSX}
 */
const CartButtonBadge = ({ count, style }) => {
  const { classes } = useStyles();
  const settings = useWidgetSettings('@shopgate/engage/components/AppBar');

  const badgeStyle = {
    boxShadow: settings.buttonCartBadgeShadow,
    ...style,
  };

  const productCount = count > CART_MAX_ITEMS ? `${CART_MAX_ITEMS}+` : count;

  return (
    <div style={badgeStyle} className={classes.badge}>{productCount}</div>
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
