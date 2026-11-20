import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The store icon component.
 */
const Store = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="store" {...props} />
);

export default Store;
