import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The account box icon component.
 */
const AccountBox = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="accountBox" {...props} />
);

export default AccountBox;
