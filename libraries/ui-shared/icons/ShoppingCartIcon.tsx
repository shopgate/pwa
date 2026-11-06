import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The shopping cart icon component.
 */
const ShoppingCart = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="shoppingCart" {...props} />
);

export default ShoppingCart;
