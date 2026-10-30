import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The browse icon component.
 */
const Browse = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="browse" {...props} />
);

export default Browse;
