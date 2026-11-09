import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The shipping method icon component.
 */
const ShippingMethodIcon = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="shipping" {...props} />
);

export default ShippingMethodIcon;
