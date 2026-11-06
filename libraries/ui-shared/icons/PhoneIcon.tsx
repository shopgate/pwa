import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The phone icon component.
 */
const Phone = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="phone" {...props} />
);

export default Phone;
