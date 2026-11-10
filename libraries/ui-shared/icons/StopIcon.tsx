import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The stop icon component.
 */
const StopIcon = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="stop" {...props} />
);

export default StopIcon;
