import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The Notification icon component.
 */
const Notification = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="notification" {...props} />
);

export default Notification;
