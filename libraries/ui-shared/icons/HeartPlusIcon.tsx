import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The heart plus icon component.
 */
const HeartPlus = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="heartPlus" {...props} />
);

export default HeartPlus;
