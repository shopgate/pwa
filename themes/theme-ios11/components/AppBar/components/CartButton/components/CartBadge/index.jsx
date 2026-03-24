import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useWidgetSettings } from '@shopgate/engage/core';
import { CART_MAX_ITEMS } from '@shopgate/engage/cart';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

const useStyles = makeStyles()({
  root: {
    position: 'absolute',
    fontSize: '0.7rem',
    lineHeight: 1.5,
    fontWeight: 700,
    background: 'var(--color-primary)',
    color: 'var(--color-primary-contrast)',
    borderRadius: variables.gap.small,
    height: variables.gap.big,
    minWidth: variables.gap.big,
    paddingLeft: (variables.gap.small / 2),
    paddingRight: (variables.gap.small / 2),
    top: 6,
    right: 4,
  },
});

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
