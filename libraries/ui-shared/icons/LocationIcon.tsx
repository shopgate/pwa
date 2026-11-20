import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The location icon component.
 */
const Location = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="location" {...props} />
);

export default Location;
