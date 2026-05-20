import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { CART_MAX_ITEMS } from '@shopgate/engage/cart';
import { makeStyles } from '@shopgate/engage/styles';
import connect from './connector';

const useStyles = makeStyles()((theme) => {
  const size = theme.spacing(2) * 1.125;
  return {
    badge: {
      backgroundColor: 'var(--color-primary)',
      borderRadius: size,
      color: 'var(--color-primary-contrast)',
      fontSize: 12,
      fontWeight: 700,
      height: size,
      minWidth: size,
      padding: theme.spacing(0, 0.625),
      position: 'absolute',
      right: 16,
      textAlign: 'center',
      top: 19,
    },
  };
});

/**
 * @param {Object} props The component props.
 * @param {number} props.count The number of product in the cart.
 * @returns {JSX}
 */
const CartButtonBadge = ({ count }) => {
  const { classes, cx } = useStyles();
  if (count <= 0) {
    return null;
  }
  return (
    <span
      className={cx(classes.badge, 'theme__navdrawer__cart-button-badge', 'theme__badge')}
      test-id="cartButtonBadge"
    >
      {Math.min(count, CART_MAX_ITEMS)}
      {count > 99 && '+'}
    </span>
  );
};

CartButtonBadge.propTypes = {
  count: PropTypes.number.isRequired,
};

export default connect(memo(CartButtonBadge));
