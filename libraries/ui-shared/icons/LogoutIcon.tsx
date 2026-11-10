import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The logout icon component.
 */
const Logout = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="logout" {...props} />
);

export default Logout;
