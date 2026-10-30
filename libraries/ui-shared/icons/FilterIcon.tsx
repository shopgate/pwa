import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The filter icon component.
 */
const Filter = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="filter" {...props} />
);

export default Filter;
