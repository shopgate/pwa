import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The sort icon component.
 */
const Sort = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="sort" {...props} />
);

export default Sort;
