import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The magnifier icon component.
 */
const Magnifier = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="magnifier" {...props} />
);

export default Magnifier;
