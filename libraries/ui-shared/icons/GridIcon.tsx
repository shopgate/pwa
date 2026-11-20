import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The grid icon component.
 */
const Grid = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="grid" {...props} />
);

export default Grid;
