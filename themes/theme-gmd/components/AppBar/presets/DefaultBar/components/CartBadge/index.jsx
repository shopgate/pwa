import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useWidgetSettings } from '@shopgate/engage/core';
import { CART_MAX_ITEMS } from '@shopgate/engage/cart';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

const useStyles = makeStyles()({
  badge: {
    position: 'absolute',
    fontSize: '0.75rem',
    lineHeight: 1.4,
    fontWeight: 700,
    background: 'var(--color-primary-contrast)',
    color: 'var(--color-primary)',
    borderRadius: variables.gap.small,
    height: variables.gap.big,
    minWidth: variables.gap.big,
    paddingLeft: (variables.gap.small / 2),
    paddingRight: (variables.gap.small / 2),
    top: 12,
    right: 18,
    transform: 'translateX(50%)',
  },
});

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
