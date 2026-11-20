import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The cart icon component.
 */
const CartIcon = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="cart" {...props} />
);

export default CartIcon;
