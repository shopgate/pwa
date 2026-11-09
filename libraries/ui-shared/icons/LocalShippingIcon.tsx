import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The local shipping icon component.
 */
const LocalShipping = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="shipping" {...props} />
);

export default LocalShipping;
