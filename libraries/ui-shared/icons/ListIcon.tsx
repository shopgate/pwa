import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The list icon component.
 */
const List = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="list" {...props} />
);

export default List;
