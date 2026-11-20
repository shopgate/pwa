import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The tick icon component.
 */
const Tick = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="tick" {...props} />
);

export default Tick;
