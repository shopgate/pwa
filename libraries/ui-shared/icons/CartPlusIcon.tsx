import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The cart plus icon component.
 */
const CartPlus = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="cartPlus" {...props} />
);

export default CartPlus;
