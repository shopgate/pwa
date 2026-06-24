import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { CART_MAX_ITEMS } from 'Pages/Cart/constants';
import connect from './connector';

const useStyles = makeStyles()(theme => ({
  root: {
    position: 'absolute',
    background: theme.components.tabBar.badgeBackground,
    color: theme.components.tabBar.badgeColor,
    display: 'flex',
    alignItems: 'center',
    fontWeight: theme.typography.fontWeightBold,
    borderRadius: theme.components.tabBar.badgeBorderRadius,
    height: theme.spacing(2),
    top: theme.components.tabBar.badgeTop,
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
    minWidth: theme.spacing(2),
    transform: 'translateX(-50%)',
    left: theme.components.tabBar.badgeLeft,
  },
}));

/**
 * The cart item badge component.
 * Shows the amount of products in the cart.
 * @param {Object} props The component props.
 * @returns {JSX.Element|null}
 */
const CartItemBadge = (props) => {
  const { classes, cx } = useStyles();

  if (!props.cartProductCount) {
    return null;
  }

  let cartProductCount = `${props.cartProductCount}`;

  if (props.cartProductCount > CART_MAX_ITEMS) {
    cartProductCount = `${CART_MAX_ITEMS}+`;
  }

  return (
    <Typography variant="caption" component="div" className={cx(classes.root, 'theme__tab-bar__cart-item-badge theme__badge')}>
      {cartProductCount}
    </Typography>
  );
};

CartItemBadge.propTypes = {
  cartProductCount: PropTypes.number.isRequired,
};

export default connect(memo(CartItemBadge));
