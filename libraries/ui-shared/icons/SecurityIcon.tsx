import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The security icon component.
 */
const Security = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="security" {...props} />
);

export default Security;
