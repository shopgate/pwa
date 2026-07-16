import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { CounterBadge } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { CART_MAX_ITEMS } from 'Pages/Cart/constants';
import connect from './connector';

const useStyles = makeStyles()(theme => ({
  root: {
    position: 'absolute',
    borderRadius: theme.components.tabBar.badgeBorderRadius,
    top: theme.components.tabBar.badgeTop,
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

  return (
    <CounterBadge
      count={props.cartProductCount}
      max={CART_MAX_ITEMS}
      className={cx(classes.root, 'theme__tab-bar__cart-item-badge')}
    />
  );
};

CartItemBadge.propTypes = {
  cartProductCount: PropTypes.number.isRequired,
};

export default connect(memo(CartItemBadge));
