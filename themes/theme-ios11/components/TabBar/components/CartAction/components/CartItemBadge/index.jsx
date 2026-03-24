import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { CART_MAX_ITEMS } from 'Pages/Cart/constants';
import connect from './connector';

const { variables } = themeConfig;

const useStyles = makeStyles()({
  root: {
    position: 'absolute',
    background: 'var(--tab-bar-item-badge-background)',
    color: 'var(--tab-bar-item-badge-color)',
    fontSize: '0.7rem',
    lineHeight: 1.5,
    fontWeight: 'bold',
    borderRadius: 'var(--tab-bar-item-badge-border-radius)',
    height: variables.gap.big,
    top: 'var(--tab-bar-item-badge-top)',
    paddingLeft: variables.gap.small / 2,
    paddingRight: variables.gap.small / 2,
    minWidth: variables.gap.big,
    transform: 'translateX(-50%)',
    left: 'var(--tab-bar-item-badge-left)',
  },
});

/**
 * The cart item badge component.
 * Shows the amount of products in the cart.
 * @param {Object} props The component props.
 * @returns {JSX.Element|null}
 */
const CartItemBadge = (props) => {
  const { classes } = useStyles();

  if (!props.cartProductCount) {
    return null;
  }

  let cartProductCount = `${props.cartProductCount}`;

  if (props.cartProductCount > CART_MAX_ITEMS) {
    cartProductCount = `${CART_MAX_ITEMS}+`;
  }

  return (
    <div className={`${classes.root} theme__tab-bar__cart-item-badge theme__badge`}>
      {cartProductCount}
    </div>
  );
};

CartItemBadge.propTypes = {
  cartProductCount: PropTypes.number.isRequired,
};

export default connect(memo(CartItemBadge));
