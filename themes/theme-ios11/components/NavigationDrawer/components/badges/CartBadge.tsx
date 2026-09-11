import { useSelector } from 'react-redux';
import { getCartProductCount } from '@shopgate/pwa-common-commerce/cart/selectors';
import { CART_MAX_ITEMS } from '@shopgate/engage/cart/cart.constants';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()((theme) => {
  const size = theme.spacing(2) * 1.125;
  return {
    badge: {
      backgroundColor: theme.palette.primary.main,
      borderRadius: size,
      color: theme.palette.primary.contrastText,
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
 * Renders the cart item count badge.
 * @returns The rendered badge.
 */
const CartBadge = () => {
  const { classes, cx } = useStyles();
  const count = useSelector(getCartProductCount);

  if (count <= 0) {
    return null;
  }

  return (
    <span className={cx(classes.badge, 'theme__navdrawer__cart-button-badge', 'theme__badge')}>
      {Math.min(count, CART_MAX_ITEMS)}
      {count > 99 && '+'}
    </span>
  );
};

export default CartBadge;
