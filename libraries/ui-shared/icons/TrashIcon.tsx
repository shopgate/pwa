import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The trash icon component.
 */
const Trash = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="trash" {...props} />
);

export default Trash;
