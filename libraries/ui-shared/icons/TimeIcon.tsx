import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The time icon component.
 */
const TimeIcon = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="time" {...props} />
);

export default TimeIcon;
