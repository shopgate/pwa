import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The warning icon component.
 */
const WarningIcon = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="warning" {...props} />
);

export default WarningIcon;
